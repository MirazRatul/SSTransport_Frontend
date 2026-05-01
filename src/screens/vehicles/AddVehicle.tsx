import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { container } from '../../constants/container';
import AppText from '../../components/AppText';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';
import CommonHeader from '../../components/CommonHeader';
import AppInput from '../../components/AppInput';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, PhotoQuality } from 'react-native-image-picker';
import { ChevronDown, X } from 'lucide-react-native';
import apiClient from '../../api/api';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@env';
import { useToast } from '../../components/Toast/ToastContext';

interface DropdownItem {
  id: string;
  name: string;
}

const AddVehicle = () => {
  const navigation = useNavigation<any>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form fields
  const [regNumber, setRegNumber] = useState('');
  const [vehicleSize, setVehicleSize] = useState<string>('');
  const [capacity, setCapacity] = useState('');
  const [assignedDriver, setAssignedDriver] = useState<string>('');
  const [assignedHelper, setAssignedHelper] = useState<string>('');
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState('');
  const [partsFixed, setPartsFixed] = useState('');

  // Image states
  const [regCardUri, setRegCardUri] = useState<string>('');
  const [fitnessCertificateUri, setFitnessCertificateUri] = useState<string>('');

  // Dropdown states
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [showHelperDropdown, setShowHelperDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // Data for dropdowns
  const [drivers, setDrivers] = useState<DropdownItem[]>([]);
  const [helpers, setHelpers] = useState<DropdownItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const vehicleSizeOptions = [
    { id: 'S', name: 'Small' },
    { id: 'M', name: 'Medium' },
    { id: 'L', name: 'Large' },
  ];

  // Fetch drivers and helpers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        // Fetch all employees
        const employeesRes = await apiClient.get('/employees');
        const allEmployees = employeesRes.data;

        // Filter drivers (role = 'driver')
        const driversData = allEmployees
          .filter((employee: any) => employee.role === 'driver')
          .map((driver: any) => ({
            id: driver.id,
            name: driver.name,
          }));
        setDrivers(driversData);

        // Filter helpers (role = 'helper')
        const helpersData = allEmployees
          .filter((employee: any) => employee.role === 'helper')
          .map((helper: any) => ({
            id: helper.id,
            name: helper.name,
          }));
        setHelpers(helpersData);
      } catch (error) {
        console.log('Error fetching data:', error);
        showToast({ message: 'Failed to load drivers and helpers', type: 'error' });
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const generateYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 20; i--) {
      years.push(i);
    }
    return years;
  };

  const generateMonths = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const generateDays = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const handleDateConfirm = () => {
    const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    setLastMaintenanceDate(formattedDate);
    setShowDatePicker(false);
  };
  const uploadToCloudinary = async (localUri: string, fileName: string): Promise<string> => {
    const filename = fileName || localUri.split('/').pop() || 'vehicle.jpg';
    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

    const formData = new FormData();
    formData.append('file', {
      uri: localUri,
      name: filename,
      type: mimeType,
    } as any);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'Vehicles');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData },
    );
    const json = await response.json();
    if (!json.secure_url) throw new Error(json.error?.message || 'Cloudinary upload failed');
    return json.secure_url;
  };

  // Image picker
  const handleImagePicker = async (type: 'regCard' | 'fitnessCertificate') => {
    const result = await launchImageLibrary({
      mediaType: 'photo' as const,
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8 as PhotoQuality,
    });
    if (result.assets && result.assets.length > 0) {
      if (type === 'regCard') {
        setRegCardUri(result.assets[0].uri || '');
      } else {
        setFitnessCertificateUri(result.assets[0].uri || '');
      }
    }
  };

  // Validate required fields
  const validateForm = () => {
    if (!regNumber.trim()) {
      showToast({ message: 'Registration number is required', type: 'warning' });
      return false;
    }
    if (!vehicleSize) {
      showToast({ message: 'Vehicle size is required', type: 'warning' });
      return false;
    }
    if (!capacity.trim()) {
      showToast({ message: 'Capacity is required', type: 'warning' });
      return false;
    }
    if (!assignedDriver) {
      showToast({ message: 'Assigned driver is required', type: 'warning' });
      return false;
    }
    if (!assignedHelper) {
      showToast({ message: 'Assigned helper is required', type: 'warning' });
      return false;
    }
    if (!regCardUri) {
      showToast({ message: 'Registration card image is required', type: 'warning' });
      return false;
    }
    if (!fitnessCertificateUri) {
      showToast({ message: 'Fitness certificate image is required', type: 'warning' });
      return false;
    }
    if (!lastMaintenanceDate) {
      showToast({ message: 'Last maintenance date is required', type: 'warning' });
      return false;
    }
    return true;
  };

  // Handle add vehicle
  const handleAddVehicle = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Upload images to Cloudinary
      const regCardUrl = await uploadToCloudinary(regCardUri, 'reg_card.jpg');
      const fitnessCertificateUrl = await uploadToCloudinary(
        fitnessCertificateUri,
        'fitness_certificate.jpg',
      );

      const vehicleData = {
        regNumber: regNumber.trim(),
        vehicleSize,
        capacity: capacity.trim(),
        assignedDriver: assignedDriver,
        assignedHelper: assignedHelper,
        regCard: regCardUrl,
        fitnessCertificate: fitnessCertificateUrl,
        lastMaintenanceDate,
        partsFixed: partsFixed.trim() || null,
      };

      // Post to backend
      await apiClient.post('/vehicles', vehicleData);

      showToast({ message: 'Vehicle added successfully!', type: 'success' });
      navigation.goBack();
    } catch (error: any) {
      console.log('Error adding vehicle:', error);
      showToast({
        message: error?.response?.data?.message || 'Failed to add vehicle',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <SafeAreaView style={[container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={AppColors.secondaryColor} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[container, { paddingBottom: s(10) }]}>
      <CommonHeader title="Add Vehicle" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{
            paddingBottom: vs(40),
          }}
        >
        {/* Registration Number */}
        <AppInput
          label="Registration Number"
          placeholder="Enter registration number (e.g., ABC-123)"
          value={regNumber}
          onChangeText={setRegNumber}
        />

        {/* Vehicle Size Dropdown */}
        <AppText style={styles.label}>Vehicle Size</AppText>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowSizeDropdown(true)}
        >
          <AppText style={styles.dropdownText}>
            {vehicleSize
              ? vehicleSizeOptions.find(opt => opt.id === vehicleSize)?.name
              : 'Select Size'}
          </AppText>
          <ChevronDown size={20} color={AppColors.textColor} />
        </TouchableOpacity>

        {/* Capacity */}
        <AppInput
          label="Capacity"
          placeholder="Enter capacity (e.g., 20 Tons)"
          value={capacity}
          onChangeText={setCapacity}
        />

        {/* Assigned Driver Dropdown */}
        <AppText style={styles.label}>Assigned Driver</AppText>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowDriverDropdown(true)}
        >
          <AppText style={styles.dropdownText}>
            {assignedDriver
              ? drivers.find(d => d.id === assignedDriver)?.name
              : 'Select Driver'}
          </AppText>
          <ChevronDown size={20} color={AppColors.textColor} />
        </TouchableOpacity>

        {/* Assigned Helper Dropdown */}
        <AppText style={styles.label}>Assigned Helper</AppText>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowHelperDropdown(true)}
        >
          <AppText style={styles.dropdownText}>
            {assignedHelper
              ? helpers.find(h => h.id === assignedHelper)?.name
              : 'Select Helper'}
          </AppText>
          <ChevronDown size={20} color={AppColors.textColor} />
        </TouchableOpacity>

        {/* Registration Card */}
        <AppText style={styles.label}>Registration Card</AppText>
        <TouchableOpacity
          style={styles.imageUploadButton}
          onPress={() => handleImagePicker('regCard')}
        >
          {regCardUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: regCardUri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setRegCardUri('')}
              >
                <X size={20} color={AppColors.primaryColor} />
              </TouchableOpacity>
            </View>
          ) : (
            <AppText style={styles.uploadText}>Tap to upload registration card</AppText>
          )}
        </TouchableOpacity>

        {/* Fitness Certificate */}
        <AppText style={styles.label}>Fitness Certificate</AppText>
        <TouchableOpacity
          style={styles.imageUploadButton}
          onPress={() => handleImagePicker('fitnessCertificate')}
        >
          {fitnessCertificateUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: fitnessCertificateUri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setFitnessCertificateUri('')}
              >
                <X size={20} color={AppColors.primaryColor} />
              </TouchableOpacity>
            </View>
          ) : (
            <AppText style={styles.uploadText}>Tap to upload fitness certificate</AppText>
          )}
        </TouchableOpacity>

        {/* Last Maintenance Date */}
        <AppText style={styles.label}>Last Maintenance Date</AppText>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <AppText style={styles.dateText}>
            {lastMaintenanceDate || 'Select Date'}
          </AppText>
        </TouchableOpacity>

        {/* Parts Fixed (Optional) */}
        <AppInput
          label="Parts Fixed (Optional)"
          placeholder="Enter parts fixed details"
          value={partsFixed}
          onChangeText={setPartsFixed}
        />

        {/* Add Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleAddVehicle}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={AppColors.primaryColor} />
            ) : (
              <AppText variant="bold" style={styles.buttonText}>
                Add Vehicle
              </AppText>
            )}
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Size Dropdown Modal */}
      <Modal visible={showSizeDropdown} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowSizeDropdown(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={vehicleSizeOptions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setVehicleSize(item.id);
                    setShowSizeDropdown(false);
                  }}
                >
                  <AppText>{item.name}</AppText>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Driver Dropdown Modal */}
      <Modal visible={showDriverDropdown} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowDriverDropdown(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={drivers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setAssignedDriver(item.id);
                    setShowDriverDropdown(false);
                  }}
                >
                  <AppText>{item.name}</AppText>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Helper Dropdown Modal */}
      <Modal visible={showHelperDropdown} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowHelperDropdown(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={helpers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setAssignedHelper(item.id);
                    setShowHelperDropdown(false);
                  }}
                >
                  <AppText>{item.name}</AppText>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowDatePicker(false)}
        >
          <View style={styles.datePickerModal}>
            <View style={styles.datePickerHeader}>
              <AppText style={styles.datePickerTitle}>Select Date</AppText>
            </View>
            
            <View style={styles.datePickerContainer}>
              {/* Year Picker */}
              <View style={styles.datePickerColumn}>
                <AppText style={styles.datePickerLabel}>Year</AppText>
                <FlatList
                  data={generateYears()}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.datePickerItem,
                        selectedYear === item && styles.datePickerItemSelected,
                      ]}
                      onPress={() => setSelectedYear(item)}
                    >
                      <AppText
                        style={[
                          styles.datePickerItemText,
                          selectedYear === item && styles.datePickerItemTextSelected,
                        ]}
                      >
                        {item}
                      </AppText>
                    </TouchableOpacity>
                  )}
                  scrollEnabled
                  nestedScrollEnabled
                />
              </View>

              {/* Month Picker */}
              <View style={styles.datePickerColumn}>
                <AppText style={styles.datePickerLabel}>Month</AppText>
                <FlatList
                  data={generateMonths()}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.datePickerItem,
                        selectedMonth === item && styles.datePickerItemSelected,
                      ]}
                      onPress={() => setSelectedMonth(item)}
                    >
                      <AppText
                        style={[
                          styles.datePickerItemText,
                          selectedMonth === item && styles.datePickerItemTextSelected,
                        ]}
                      >
                        {String(item).padStart(2, '0')}
                      </AppText>
                    </TouchableOpacity>
                  )}
                  scrollEnabled
                  nestedScrollEnabled
                />
              </View>

              {/* Day Picker */}
              <View style={styles.datePickerColumn}>
                <AppText style={styles.datePickerLabel}>Day</AppText>
                <FlatList
                  data={generateDays()}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.datePickerItem,
                        selectedDay === item && styles.datePickerItemSelected,
                      ]}
                      onPress={() => setSelectedDay(item)}
                    >
                      <AppText
                        style={[
                          styles.datePickerItemText,
                          selectedDay === item && styles.datePickerItemTextSelected,
                        ]}
                      >
                        {String(item).padStart(2, '0')}
                      </AppText>
                    </TouchableOpacity>
                  )}
                  scrollEnabled
                  nestedScrollEnabled
                />
              </View>
            </View>

            <View style={styles.datePickerFooter}>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(false)}
              >
                <AppText style={styles.datePickerButtonText}>Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.datePickerButton, styles.datePickerButtonConfirm]}
                onPress={handleDateConfirm}
              >
                <AppText style={styles.datePickerButtonTextConfirm}>Confirm</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default AddVehicle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingTop: vs(16),
  },
  label: {
    color: AppColors.textColor,
    marginBottom: s(4),
    marginTop: s(14),
    fontSize: s(14),
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: AppColors.inputColor,
    borderWidth: 1,
    borderRadius: s(6),
    paddingHorizontal: s(12),
    paddingVertical: s(12),
    marginTop: s(4),
    marginBottom: s(8),
  },
  dropdownText: {
    color: AppColors.textColor,
    fontSize: s(14),
  },
  dateInput: {
    borderColor: AppColors.inputColor,
    borderWidth: 1,
    borderRadius: s(6),
    paddingHorizontal: s(12),
    paddingVertical: s(12),
    marginTop: s(4),
    marginBottom: s(8),
    justifyContent: 'center',
  },
  dateText: {
    color: AppColors.textColor,
    fontSize: s(14),
  },
  imageUploadButton: {
    borderColor: AppColors.inputColor,
    borderWidth: 1.5,
    borderRadius: s(6),
    paddingVertical: s(30),
    marginTop: s(4),
    marginBottom: s(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  uploadText: {
    color: AppColors.textColor,
    fontSize: s(14),
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
  },
  previewImage: {
    width: s(100),
    height: s(100),
    borderRadius: s(6),
  },
  removeImageButton: {
    position: 'absolute',
    top: -s(10),
    right: s(10),
    backgroundColor: AppColors.secondaryColor,
    borderRadius: s(12),
    padding: s(4),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AppColors.cardColor,
    borderTopLeftRadius: s(12),
    borderTopRightRadius: s(12),
    maxHeight: '60%',
  },
  modalItem: {
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    borderBottomColor: AppColors.inputColor,
    borderBottomWidth: 1,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.secondaryColor,
    height: s(48),
    borderRadius: s(6),
    paddingHorizontal: s(16),
  },
  buttonText: {
    color: AppColors.primaryColor,
    fontSize: s(18),
  },
  buttonContainer: {
    marginTop: vs(30),
    width: '100%',
  },
  datePickerModal: {
    backgroundColor: AppColors.cardColor,
    borderTopLeftRadius: s(12),
    borderTopRightRadius: s(12),
    maxHeight: '70%',
  },
  datePickerHeader: {
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    borderBottomColor: AppColors.inputColor,
    borderBottomWidth: 1,
  },
  datePickerTitle: {
    color: AppColors.textColor,
    fontSize: s(16),
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxHeight: '60%',
    paddingHorizontal: s(8),
  },
  datePickerColumn: {
    flex: 1,
    maxHeight: s(200),
    paddingHorizontal: s(4),
  },
  datePickerLabel: {
    color: AppColors.textColor,
    fontSize: s(12),
    textAlign: 'center',
    paddingVertical: s(8),
  },
  datePickerItem: {
    paddingVertical: vs(8),
    paddingHorizontal: s(8),
    alignItems: 'center',
    borderRadius: s(4),
  },
  datePickerItemSelected: {
    backgroundColor: AppColors.secondaryColor,
  },
  datePickerItemText: {
    color: AppColors.textColor,
    fontSize: s(14),
  },
  datePickerItemTextSelected: {
    color: AppColors.primaryColor,
  },
  datePickerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    borderTopColor: AppColors.inputColor,
    borderTopWidth: 1,
  },
  datePickerButton: {
    paddingVertical: vs(10),
    paddingHorizontal: s(20),
    borderRadius: s(6),
    backgroundColor: AppColors.inputColor,
  },
  datePickerButtonConfirm: {
    backgroundColor: AppColors.secondaryColor,
  },
  datePickerButtonText: {
    color: AppColors.textColor,
    fontSize: s(14),
  },
  datePickerButtonTextConfirm: {
    color: AppColors.primaryColor,
    fontSize: s(14),
  },
});
