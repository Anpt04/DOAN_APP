import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Feather } from '@expo/vector-icons';

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    
  const auth = getAuth();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp.');
      return;
    }

    const user = auth.currentUser;

    if (!user || !user.email) {
      Alert.alert('Lỗi', 'Không tìm thấy người dùng hiện tại.');
      return;
    }

    try {
      // Xác thực lại người dùng
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Đổi mật khẩu
      await updatePassword(user, newPassword);
      Alert.alert('Thành công', 'Mật khẩu đã được thay đổi!');
    } catch (error: any) {
      console.log("Lỗi đổi mật khẩu:", error);
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Lỗi', 'Mật khẩu hiện tại không đúng.');
      } else {
        Alert.alert('Lỗi', 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đổi mật khẩu</Text>

    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu hiện tại"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry={!isPasswordVisible}
      />
      <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Feather 
            name={isPasswordVisible ? 'eye-off' : 'eye'} 
            size={22} 
            color="#555" 
          />
        </TouchableOpacity>
    </View>

    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry={!isNewPasswordVisible}
      />
      <TouchableOpacity onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}>
          <Feather 
            name={isNewPasswordVisible ? 'eye-off' : 'eye'} 
            size={22} 
            color="#555" 
          />
        </TouchableOpacity>
    </View>

    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu mới"
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        secureTextEntry={!isNewPasswordVisible}
      />
      <TouchableOpacity onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}>
          <Feather 
            name={isNewPasswordVisible ? 'eye-off' : 'eye'} 
            size={22} 
            color="#555" 
          />
        </TouchableOpacity>
    </View>

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Xác nhận đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
});
