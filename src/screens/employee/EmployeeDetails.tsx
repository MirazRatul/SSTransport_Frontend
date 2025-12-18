import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { AppColors } from '../../styles/colors';
import { scale as s, vs } from 'react-native-size-matters';
import AppText from '../../components/AppText';
import { X } from 'lucide-react-native';

interface EmployeeDetailsProps {
  modalVisible: boolean;
  imageURI: string;
  name: string;
  title: string;
  onClose: () => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  modalVisible,
  imageURI,
  name,
  title,
  onClose,
}) => {
  return (
    <Modal animationType="slide" visible={modalVisible} transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: imageURI }} style={styles.image} />
          <AppText variant="bold">{name}</AppText>
          <AppText>{title}</AppText>

          <TouchableOpacity style={styles.close} onPress={onClose}>
            <X size={20} color={AppColors.textColor}/>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EmployeeDetails;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(20),
    elevation: 5
  },
  image: {
    height: s(80),
    width: s(80),
    borderRadius: s(40),
    marginBottom: vs(10),
  },
  modalContainer: {
    width: '100%',
    backgroundColor: AppColors.primaryColor,
    borderWidth: 1,
    borderRadius: s(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: vs(20),
  },
  close: {
    height: s(30),
    width: s(30),
    position: 'absolute',
    borderWidth: 1,
    borderRadius: s(15),
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(5),
    top: s(10),
    right: s(10)
  }
});
