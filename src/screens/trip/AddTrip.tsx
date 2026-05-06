import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { container } from '../../constants/container';
import AppText from '../../components/AppText';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';
import CommonHeader from '../../components/CommonHeader';
import AppInput from '../../components/AppInput';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronDown } from 'lucide-react-native';
import apiClient from '../../api/api';
import { useToast } from '../../components/Toast/ToastContext';
import PermissionDeniedState from '../../components/PermissionDeniedState';
import { isPermissionError } from '../../utils/permissionError';

interface DropdownItem {
  id: string;
  name: string;
  role?: string;
}

interface CrewData {
  driverId: number;
  driverName: string;
  helperId: number;
  helperName: string;
}

interface TripDetail {
  id: number | string;
  date?: string;
  pickupDest?: string;
  dropDest?: string;
  clientName?: string;
  clientContact?: string;
  driverId?: number | string;
  driverName?: string;
  helperId?: number | string;
  helperName?: string;
  vehicleId?: number | string;
  vehicleRegNumber?: string;
  status?: string;
  fare?: number | string;
  goodsType?: string;
}

const AddTrip = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { mode, tripId } = route.params || {};
  const isEditMode = mode === 'edit' && !!tripId;

  // Form fields
  const [date, setDate] = useState('');
  const [pickupDest, setPickupDest] = useState('');
  const [dropDest, setDropDest] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [driverId, setDriverId] = useState<string>('');
  const [helperId, setHelperId] = useState<string>('');
  const [vehicleId, setVehicleId] = useState<string>('');
  const [fare, setFare] = useState('');
  const [goodsType, setGoodsType] = useState('');

  // Dropdown states
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [showHelperDropdown, setShowHelperDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Date picker states
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [selectedMinute, setSelectedMinute] = useState(new Date().getMinutes());

  // Data for dropdowns
  const [vehicles, setVehicles] = useState<DropdownItem[]>([]);
  const [drivers, setDrivers] = useState<DropdownItem[]>([]);
  const [helpers, setHelpers] = useState<DropdownItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);



  const syncDatePicker = useCallback((dateValue?: string) => {
    if (!dateValue) return;

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) return;

    setSelectedYear(parsedDate.getFullYear());
    setSelectedMonth(parsedDate.getMonth() + 1);
    setSelectedDay(parsedDate.getDate());
    setSelectedHour(parsedDate.getHours());
    setSelectedMinute(parsedDate.getMinutes());
  }, []);

  const populateTripForm = useCallback((trip: TripDetail) => {
    const vehicleIdValue = trip.vehicleId?.toString() || '';
    const driverIdValue = trip.driverId?.toString() || '';
    const helperIdValue = trip.helperId?.toString() || '';

    setDate(trip.date || '');
    setPickupDest(trip.pickupDest || '');
    setDropDest(trip.dropDest || '');
    setClientName(trip.clientName || '');
    setClientContact(trip.clientContact || '');
    setVehicleId(vehicleIdValue);
    setDriverId(driverIdValue);
    setHelperId(helperIdValue);
    setFare(trip.fare?.toString() || '');
    setGoodsType(trip.goodsType || '');
    syncDatePicker(trip.date);

    if (driverIdValue || trip.driverName) {
      setDrivers([
        { id: driverIdValue, name: trip.driverName || driverIdValue },
      ]);
    }

    if (helperIdValue || trip.helperName) {
      setHelpers([
        { id: helperIdValue, name: trip.helperName || helperIdValue },
      ]);
    }

    if (vehicleIdValue && trip.vehicleRegNumber) {
      setVehicles(currentVehicles => {
        const exists = currentVehicles.some(item => item.id === vehicleIdValue);
        if (exists) return currentVehicles;
        return [
          ...currentVehicles,
          { id: vehicleIdValue, name: trip.vehicleRegNumber || vehicleIdValue },
        ];
      });
    }
  }, [syncDatePicker]);

  // Fetch vehicles and initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        if (!isEditMode) {
          await apiClient.get('/trips');
        }

        const vehiclesRes = await apiClient.get('/vehicles');
        const vehiclesData = vehiclesRes.data.map((vehicle: any) => ({
          id: vehicle.id.toString(),
          name: vehicle.regNumber,
        }));
        setVehicles(vehiclesData);

        if (isEditMode) {
          const tripRes = await apiClient.get(`/trips/details/${tripId}`);
          populateTripForm(tripRes.data);
          
          // Fetch all employees
          const employeesRes = await apiClient.get('/employees');
          const allEmployees = employeesRes.data;

          // Filter drivers
          const driversList = allEmployees
            .filter((emp: any) => emp.role?.toLowerCase() === 'driver')
            .map((driver: any) => ({
              id: driver.id.toString(),
              name: driver.name,
              role: driver.role,
            }));
          setDrivers(driversList);

          // Filter helpers
          const helpersList = allEmployees
            .filter((emp: any) => emp.role?.toLowerCase() === 'helper')
            .map((helper: any) => ({
              id: helper.id.toString(),
              name: helper.name,
              role: helper.role,
            }));
          setHelpers(helpersList);
        }
        setPermissionDenied(false);
      } catch (error: any) {
        console.log('Error fetching data:', error);
        if (isPermissionError(error)) {
          setPermissionDenied(true);
          return;
        }

        showToast({
          message: isEditMode
            ? 'Failed to load trip details'
            : 'Failed to load vehicles',
          type: 'error',
        });
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [isEditMode, populateTripForm, showToast, tripId]);

  // Fetch crew when vehicle is selected (only in add mode)
  const handleVehicleSelect = async (vehicleIdSelected: string) => {
    setVehicleId(vehicleIdSelected);
    setShowVehicleDropdown(false);

    // Only auto-fill in add mode
    if (!isEditMode) {
      try {
        const response = await apiClient.get(`/vehicles/crew/${vehicleIdSelected}`);
        const crewData: CrewData = response.data;
        
        // Set driver
        setDriverId(crewData.driverId.toString());
        setDrivers([{ id: crewData.driverId.toString(), name: crewData.driverName }]);
        
        // Set helper
        setHelperId(crewData.helperId.toString());
        setHelpers([{ id: crewData.helperId.toString(), name: crewData.helperName }]);
        
        showToast({ message: 'Driver and Helper auto-filled', type: 'success' });
      } catch (error: any) {
        console.log('Error fetching crew:', error);
        if (isPermissionError(error)) {
          setPermissionDenied(true);
          return;
        }

        showToast({ message: 'Failed to load driver and helper', type: 'error' });
      }
    }
  };

  const handleDriverSelect = (selectedDriverId: string) => {
    setDriverId(selectedDriverId);
    setShowDriverDropdown(false);
  };

  const handleHelperSelect = (selectedHelperId: string) => {
    setHelperId(selectedHelperId);
    setShowHelperDropdown(false);
  };

  const generateYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i <= currentYear + 5; i++) {
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

  const generateHours = () => {
    return Array.from({ length: 24 }, (_, i) => i);
  };

  const generateMinutes = () => {
    return Array.from({ length: 60 }, (_, i) => i);
  };

  const handleDateConfirm = () => {
    const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}T${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    setDate(formattedDate);
    setShowDatePicker(false);
  };

  // Validate required fields
  const validateForm = () => {
    if (!date.trim()) {
      showToast({ message: 'Date and time is required', type: 'warning' });
      return false;
    }
    if (!pickupDest.trim()) {
      showToast({ message: 'Pickup destination is required', type: 'warning' });
      return false;
    }
    if (!dropDest.trim()) {
      showToast({ message: 'Drop destination is required', type: 'warning' });
      return false;
    }
    if (!clientName.trim()) {
      showToast({ message: 'Client name is required', type: 'warning' });
      return false;
    }
    if (!clientContact.trim()) {
      showToast({ message: 'Client contact is required', type: 'warning' });
      return false;
    }
    if (!vehicleId) {
      showToast({ message: 'Vehicle is required', type: 'warning' });
      return false;
    }
    if (!fare.trim()) {
      showToast({ message: 'Fare is required', type: 'warning' });
      return false;
    }
    if (!goodsType.trim()) {
      showToast({ message: 'Goods type is required', type: 'warning' });
      return false;
    }
    return true;
  };

  // Handle add or update trip
  const handleSaveTrip = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const tripData: any = {
        date,
        pickupDest: pickupDest.trim(),
        dropDest: dropDest.trim(),
        clientName: clientName.trim(),
        clientContact: clientContact.trim(),
        driverId: parseInt(driverId, 10),
        helperId: parseInt(helperId, 10),
        vehicleId: vehicleId,
        fare: parseInt(fare, 10),
        goodsType: goodsType.trim(),
      };

      // Only add status for new trips
      if (!isEditMode) {
        tripData.status = 'pending';
      }

      if (isEditMode) {
        await apiClient.put(`/trips/${tripId}`, tripData);
      } else {
        await apiClient.post('/trips', tripData);
      }

      showToast({
        message: isEditMode
          ? 'Trip updated successfully!'
          : 'Trip added successfully!',
        type: 'success',
      });
      navigation.goBack();
    } catch (error: any) {
      console.log('Error saving trip:', error);
      console.log('Error response:', error?.response?.data);
      if (isPermissionError(error)) {
        setPermissionDenied(true);
        return;
      }

      showToast({
        message:
          error?.response?.data?.message ||
          (isEditMode ? 'Failed to update trip' : 'Failed to add trip'),
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

  if (permissionDenied) {
    return (
      <SafeAreaView style={[container, { paddingBottom: s(10) }]}>
        <CommonHeader title={isEditMode ? 'Edit Trip' : 'Add Trip'} />
        <PermissionDeniedState
          title="Trip access restricted"
          message={`You do not have permission to ${isEditMode ? 'edit' : 'create'} trips. Please contact an administrator if this access is required.`}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[container, { paddingBottom: s(10) }]}>
      <CommonHeader title={isEditMode ? 'Edit Trip' : 'Add Trip'} />
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
          {/* Date and Time */}
          <AppText style={styles.label}>Date and Time</AppText>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <AppText style={styles.dateText}>
              {date || 'Select Date and Time'}
            </AppText>
          </TouchableOpacity>

          {/* Pickup Destination */}
          <AppInput
            label="Pickup Destination"
            placeholder="Enter pickup location"
            value={pickupDest}
            onChangeText={setPickupDest}
          />

          {/* Drop Destination */}
          <AppInput
            label="Drop Destination"
            placeholder="Enter drop location"
            value={dropDest}
            onChangeText={setDropDest}
          />

          {/* Client Name */}
          <AppInput
            label="Client Name"
            placeholder="Enter client name"
            value={clientName}
            onChangeText={setClientName}
          />

          {/* Client Contact */}
          <AppInput
            label="Client Contact"
            placeholder="Enter contact number"
            value={clientContact}
            onChangeText={setClientContact}
          />

          {/* Vehicle Selection */}
          <AppText style={styles.label}>Select Vehicle</AppText>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowVehicleDropdown(true)}
          >
            <AppText style={styles.dropdownText}>
              {vehicleId
                ? vehicles.find(v => v.id === vehicleId)?.name
                : 'Select Vehicle'}
            </AppText>
            <ChevronDown size={20} color={AppColors.textColor} />
          </TouchableOpacity>

          {/* Driver */}
          <AppText style={styles.label}>
            Driver {isEditMode ? '' : '(Auto-filled)'}
          </AppText>
          {isEditMode ? (
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowDriverDropdown(true)}
            >
              <AppText style={styles.dropdownText}>
                {driverId
                  ? drivers.find(d => d.id === driverId)?.name
                  : 'Select Driver'}
              </AppText>
              <ChevronDown size={20} color={AppColors.textColor} />
            </TouchableOpacity>
          ) : (
            <View style={[styles.dropdownButton, { opacity: 0.6 }]}>
              <AppText style={styles.dropdownText}>
                {driverId ? drivers[0]?.name : 'Will auto-fill when vehicle selected'}
              </AppText>
            </View>
          )}

          {/* Helper */}
          <AppText style={styles.label}>
            Helper {isEditMode ? '' : '(Auto-filled)'}
          </AppText>
          {isEditMode ? (
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowHelperDropdown(true)}
            >
              <AppText style={styles.dropdownText}>
                {helperId
                  ? helpers.find(h => h.id === helperId)?.name
                  : 'Select Helper'}
              </AppText>
              <ChevronDown size={20} color={AppColors.textColor} />
            </TouchableOpacity>
          ) : (
            <View style={[styles.dropdownButton, { opacity: 0.6 }]}>
              <AppText style={styles.dropdownText}>
                {helperId ? helpers[0]?.name : 'Will auto-fill when vehicle selected'}
              </AppText>
            </View>
          )}

          {/* Fare */}
          <AppInput
            label="Fare"
            placeholder="Enter fare amount"
            value={fare}
            onChangeText={setFare}
          />

          {/* Goods Type */}
          <AppInput
            label="Goods Type"
            placeholder="Enter type of goods"
            value={goodsType}
            onChangeText={setGoodsType}
          />

          {/* Add Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleSaveTrip}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={AppColors.primaryColor} />
              ) : (
                <AppText variant="bold" style={styles.buttonText}>
                  {isEditMode ? 'Update Trip' : 'Add Trip'}
                </AppText>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Vehicle Dropdown Modal */}
      <Modal visible={showVehicleDropdown} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowVehicleDropdown(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={vehicles}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleVehicleSelect(item.id)}
                >
                  <AppText>{item.name}</AppText>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Driver Dropdown Modal */}
      {isEditMode && (
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
                    onPress={() => handleDriverSelect(item.id)}
                  >
                    <AppText>{item.name}</AppText>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Helper Dropdown Modal */}
      {isEditMode && (
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
                    onPress={() => handleHelperSelect(item.id)}
                  >
                    <AppText>{item.name}</AppText>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* DateTime Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowDatePicker(false)}
        >
          <View style={styles.datePickerModal}>
            <View style={styles.datePickerHeader}>
              <AppText style={styles.datePickerTitle}>Select Date and Time</AppText>
            </View>

            <View style={styles.dateTimePickerContainer}>
              {/* Year */}
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

              {/* Month */}
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

              {/* Day */}
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

              {/* Hour */}
              <View style={styles.datePickerColumn}>
                <AppText style={styles.datePickerLabel}>Hour</AppText>
                <FlatList
                  data={generateHours()}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.datePickerItem,
                        selectedHour === item && styles.datePickerItemSelected,
                      ]}
                      onPress={() => setSelectedHour(item)}
                    >
                      <AppText
                        style={[
                          styles.datePickerItemText,
                          selectedHour === item && styles.datePickerItemTextSelected,
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

              {/* Minute */}
              <View style={styles.datePickerColumn}>
                <AppText style={styles.datePickerLabel}>Minute</AppText>
                <FlatList
                  data={generateMinutes()}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.datePickerItem,
                        selectedMinute === item && styles.datePickerItemSelected,
                      ]}
                      onPress={() => setSelectedMinute(item)}
                    >
                      <AppText
                        style={[
                          styles.datePickerItemText,
                          selectedMinute === item && styles.datePickerItemTextSelected,
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

export default AddTrip;

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
    fontSize: s(15),
    fontWeight: 'bold',
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
    maxHeight: '80%',
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
  dateTimePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxHeight: '60%',
    paddingHorizontal: s(4),
  },
  datePickerColumn: {
    flex: 1,
    maxHeight: s(150),
    paddingHorizontal: s(2),
  },
  datePickerLabel: {
    color: AppColors.textColor,
    fontSize: s(10),
    textAlign: 'center',
    paddingVertical: s(4),
  },
  datePickerItem: {
    paddingVertical: vs(6),
    paddingHorizontal: s(4),
    alignItems: 'center',
    borderRadius: s(4),
  },
  datePickerItemSelected: {
    backgroundColor: AppColors.secondaryColor,
  },
  datePickerItemText: {
    color: AppColors.textColor,
    fontSize: s(12),
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
