import {
  ActivityIndicator,
  AppState,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { container } from '../../constants/container';
import AppText from '../../components/AppText';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { clearUserData } from '../../store/reducers/userSlice';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';
import { LogOut, PencilLine, Save, X } from 'lucide-react-native';
import CommonHeader from '../../components/CommonHeader';
import { launchImageLibrary, PhotoQuality } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/api';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@env';
import ProfileSkeleton from '../../components/SkeletonLoader/ProfileSkeleton';
import { useToast } from '../../components/Toast/ToastContext';

interface UserData {
  id: string;
  name: string;
  email: string;
  contact: string;
  imageUrl?: string;
}

const Profile = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [fetchFailed, setFetchFailed] = useState(false);

  // edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editContact, setEditContact] = useState('');
  const [nameInputFocused, setNameInputFocused] = useState(false);
  const [contactInputFocused, setContactInputFocused] = useState(false);
  const [editImageUri, setEditImageUri] = useState<string | undefined>(
    undefined,
  ); // local URI
  const [editImageUrl, setEditImageUrl] = useState<string | undefined>(
    undefined,
  ); // existing remote URL

  // ─── Enter edit mode ───────────────────────────────────────────────────────
  const enterEditMode = React.useCallback((data: UserData | null) => {
    setEditName(data?.name ?? '');
    setEditContact(data?.contact ?? '');
    setEditImageUri(undefined);
    setEditImageUrl(data?.imageUrl ?? undefined);
    setEditMode(true);
  }, []);

  // ─── Fetch admin profile from backend ─────────────────────────────────────
  const fetchUserData = React.useCallback(async (
    id?: string | null,
    showLoader = true,
  ) => {
    const resolvedId = id ?? userId;
    if (!resolvedId) return;
    try {
      if (showLoader) setLoading(true);
      const response = await apiClient.get(`/admins/${resolvedId}`);
      const data: UserData = response.data;
      setUserData(data);
      setFetchFailed(false);
    } catch (error: any) {
      // 404 means admin not yet created — show edit form to create
      if (error?.response?.status === 404) {
        setUserData(null);
        setFetchFailed(false);
        enterEditMode(null);
      } else {
        setFetchFailed(true);
        console.log('Error Fetching User Data: ', error);
      }
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [enterEditMode, userId]);

  // ─── Fetch user id & email from AsyncStorage ──────────────────────────────
  const fetchUserIdEmail = React.useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('userData');
      const id = stored ? JSON.parse(stored).id : null;
      const email = stored ? JSON.parse(stored).email : null;
      setUserId(id);
      setUserEmail(email);
      await fetchUserData(id);
    } catch (error) {
      console.log('Error fetching user ID:', error);
    }
  }, [fetchUserData]);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserIdEmail();
    }, [fetchUserIdEmail]),
  );

  useEffect(() => {
    if (!fetchFailed || !userId) return;

    const retryFetch = () => {
      if (AppState.currentState === 'active') {
        fetchUserData(userId, false);
      }
    };

    const intervalId = setInterval(retryFetch, 5000);
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') retryFetch();
    });

    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, [fetchFailed, fetchUserData, userId]);

  const cancelEdit = () => {
    setEditMode(false);
    setEditImageUri(undefined);
  };

  // ─── Image picker ──────────────────────────────────────────────────────────
  const handleImagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo' as const,
      maxWidth: 600,
      maxHeight: 600,
      quality: 0.8 as PhotoQuality,
    });
    if (result.assets && result.assets.length > 0) {
      setEditImageUri(result.assets[0].uri);
    }
  };

  // ─── Upload image to Cloudinary ────────────────────────────────────────────
  const uploadToCloudinary = async (localUri: string): Promise<string> => {
    const filename = localUri.split('/').pop() ?? 'profile.jpg';
    const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

    const formData = new FormData();
    formData.append('file', {
      uri: localUri,
      name: filename,
      type: mimeType,
    } as any);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'profiles');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData },
    );
    const json = await response.json();
    console.log('Cloudinary response:', JSON.stringify(json));
    if (!json.secure_url) throw new Error(json.error?.message ?? 'Cloudinary upload failed');
    return json.secure_url;
  };

  // ─── Save profile (POST or PUT) ────────────────────────────────────────────
  const handleSave = async () => {
    if (!editName.trim()) {
      showToast({ message: 'Name is required.', type: 'warning' });
      return;
    }
    try {
      setSaving(true);

      // Upload new image if selected
      let finalImageUrl = editImageUrl;
      if (editImageUri) {
        finalImageUrl = await uploadToCloudinary(editImageUri);
      }

      const body = {
        id: userId,
        email: userEmail,
        name: editName.trim(),
        contact: editContact.trim(),
        imageUrl: finalImageUrl,
      };

      if (userData) {
        // PUT — update existing
        const response = await apiClient.put(`/admins/${userId}`, body);
        setUserData(response.data);
      } else {
        // POST — create new
        const response = await apiClient.post('/admins', body);
        setUserData(response.data);
      }

      setEditImageUri(undefined);
      setEditImageUrl(undefined);
      setEditMode(false);
      showToast({ message: 'Profile saved successfully.', type: 'success' });
    } catch (error) {
      console.log('Error saving profile:', error);
      showToast({ message: 'Failed to save profile. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await auth().signOut();
    await GoogleSignin.signOut();
    dispatch(clearUserData());
  };

  // ─── Displayed image URI ───────────────────────────────────────────────────
  const displayImage = editImageUri ?? editImageUrl ?? userData?.imageUrl;

  return (
    <SafeAreaView style={container}>
      <CommonHeader title="Profile" />
      {loading ? (
        <ProfileSkeleton />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileContainer}>
            {/* ── Avatar ── */}
            <View style={styles.avatarWrapper}>
              {displayImage ? (
                <Image source={{ uri: displayImage }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.avatarPlaceholder]}>
                  <AppText style={{ fontSize: s(30) }}>👤</AppText>
                </View>
              )}
              {editMode && (
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={handleImagePicker}
                >
                  <PencilLine size={s(18)} color={AppColors.primaryColor} />
                </TouchableOpacity>
              )}
            </View>

            {/* ── Email (never editable) ── */}
            <AppText style={styles.emailText}>{userEmail}</AppText>

            {editMode ? (
              /* ── Edit fields ── */
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.fieldsContainer}
              >
                <AppText style={styles.label}>Name</AppText>
                <TextInput
                  style={[styles.input, nameInputFocused && styles.inputFocused]}
                  value={editName}
                  onChangeText={setEditName}
                  onFocus={() => setNameInputFocused(true)}
                  onBlur={() => setNameInputFocused(false)}
                  placeholder="Enter name"
                  placeholderTextColor="#888"
                />

                <AppText style={styles.label}>Contact</AppText>
                <TextInput
                  style={[styles.input, contactInputFocused && styles.inputFocused]}
                  value={editContact}
                  onFocus={() => {
                    setContactInputFocused(true);
                    if (!editContact) {
                      setEditContact('+880');
                    }
                  }}
                  onBlur={() => setContactInputFocused(false)}
                  onChangeText={setEditContact}
                  placeholder="Enter contact"
                  placeholderTextColor="#888"
                  keyboardType="phone-pad"
                />

                {/* Action buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.cancelBtn]}
                    onPress={cancelEdit}
                    disabled={saving}
                  >
                    <X size={s(16)} color={AppColors.textColor} />
                    <AppText style={styles.actionBtnText}>Cancel</AppText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.saveBtn]}
                    onPress={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator
                        size="small"
                        color={AppColors.primaryColor}
                      />
                    ) : (
                      <>
                        <Save size={s(16)} color={AppColors.primaryColor} />
                        <AppText
                          style={[
                            styles.actionBtnText,
                            { color: AppColors.primaryColor },
                          ]}
                        >
                          Save
                        </AppText>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            ) : (
              /* ── View mode ── */
              <View style={styles.fieldsContainer}>
                <AppText style={styles.infoText}>
                  {userData?.name ?? '—'}
                </AppText>
                <AppText style={styles.infoText}>
                  {userData?.contact ?? '—'}
                </AppText>

                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => enterEditMode(userData)}
                >
                  <PencilLine size={s(16)} color={AppColors.primaryColor} />
                  <AppText
                    style={[
                      styles.actionBtnText,
                      { color: AppColors.primaryColor },
                    ]}
                  >
                    Edit Profile
                  </AppText>
                </TouchableOpacity>
              </View>
            )}

            {/* ── Sign out ── */}
            {!editMode && (
              <TouchableOpacity onPress={handleSignOut} style={styles.logOut}>
                <LogOut
                  size={s(18)}
                  color={AppColors.primaryColor}
                  style={styles.icon}
                />
                <AppText
                  variant="bold"
                  style={{ color: AppColors.primaryColor }}
                >
                  Sign Out
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: vs(20),
  },
  profileContainer: {
    width: '90%',
    alignItems: 'center',
    gap: s(14),
    paddingVertical: s(36),
    backgroundColor: AppColors.cardColor,
    alignSelf: 'center',
    borderRadius: s(12),
    elevation: 5,
  },
  avatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: s(100),
    height: s(100),
  },
  image: {
    height: s(90),
    width: s(90),
    borderRadius: s(45),
    borderWidth: 1,
    borderColor: AppColors.textColor,
  },
  avatarPlaceholder: {
    backgroundColor: AppColors.inputColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: s(4),
    backgroundColor: AppColors.secondaryColor,
    borderRadius: s(5),
  },
  emailText: {
    fontSize: s(13),
    color: '#aaa',
  },
  fieldsContainer: {
    width: '80%',
    alignItems: 'center',
    gap: s(10),
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: s(12),
    color: '#aaa',
    marginBottom: -s(6),
  },
  input: {
    width: '100%',
    backgroundColor: AppColors.inputColor,
    color: AppColors.textColor,
    borderRadius: s(8),
    paddingHorizontal: s(12),
    paddingVertical: s(10),
    fontSize: s(14),
    borderWidth: 1,
    borderColor: '#333',
  },
  inputFocused: {
    borderColor: AppColors.secondaryColor,
  },
  infoText: {
    fontSize: s(15),
    color: AppColors.textColor,
  },
  actionRow: {
    flexDirection: 'row',
    gap: s(10),
    marginTop: s(6),
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    paddingHorizontal: s(16),
    paddingVertical: s(9),
    borderRadius: s(8),
  },
  saveBtn: {
    backgroundColor: AppColors.secondaryColor,
  },
  cancelBtn: {
    backgroundColor: AppColors.inputColor,
    borderWidth: 1,
    borderColor: '#444',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingHorizontal: s(16),
    paddingVertical: s(9),
    backgroundColor: AppColors.secondaryColor,
    borderRadius: s(8),
    marginTop: s(4),
  },
  actionBtnText: {
    fontSize: s(13),
    fontWeight: '600',
    color: AppColors.textColor,
  },
  logOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingHorizontal: s(16),
    paddingVertical: s(9),
    backgroundColor: '#c0392b',
    borderRadius: s(8),
  },
  icon: {
    marginRight: s(2),
  },
});
