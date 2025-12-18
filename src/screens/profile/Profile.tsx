import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { container } from '../../constants/container';
import AppText from '../../components/AppText';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { clearUserData } from '../../store/reducers/userSlice';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { scale as s } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';
import { LogOut } from 'lucide-react-native';

const Profile = () => {
  const profileData = [
    {
      imageURI:
        'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg',
      name: 'Mirajul Islam',
      email: 'mirajulislam@gmail.com',
      phone: '+8801740825020',
    },
  ];

  const dispatch = useDispatch();

  const handleSignOut = async () => {
    await auth().signOut();
    await GoogleSignin.signOut();
    dispatch(clearUserData());
  };
  return (
    <SafeAreaView style={container}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {profileData.map(item => (
          <View style={styles.profileContainer} key={item.email}>
            <Image source={{ uri: item.imageURI }} style={styles.image} />
            <AppText style={styles.text}>{item.name}</AppText>
            <AppText>{item.email}</AppText>
            <AppText>{item.phone}</AppText>
            <TouchableOpacity onPress={handleSignOut} style={styles.logOut}>
              <LogOut
                size={24}
                color={AppColors.primaryColor}
                style={styles.icon}
              />
              <AppText variant="bold" style={{ color: AppColors.primaryColor }}>
                SignOut
              </AppText>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileContainer: {
    justifyContent: 'flex-start',
    width: '90%',
    alignItems: 'center',
    gap: s(13),
    paddingVertical: s(50),
    backgroundColor: AppColors.cardColor,
    alignSelf: 'center',
    borderRadius: s(10),
    elevation: 5,
  },
  logOut: {
    flexDirection: 'row',
    padding: s(8),
    backgroundColor: AppColors.secondaryColor,
    borderRadius: s(5),
  },
  icon: {
    marginRight: s(5),
  },
  image: {
    height: s(80),
    width: s(80),
    borderRadius: s(40),
    borderWidth: 1,
    borderColor: AppColors.textColor,
    elevation: 4,
  },
  text: {
    fontSize: s(18),
  },
});
