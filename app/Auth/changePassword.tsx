import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/themeContext';

const ChangePasswordScreen = () => {
  const { theme } = useTheme();

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
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Đổi mật khẩu</Text>

      <View style={[styles.passwordContainer, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border }]}>
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder="Mật khẩu hiện tại"
          placeholderTextColor={theme.colors.placeholder}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Feather
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={22}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.passwordContainer, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border }]}>
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder="Mật khẩu mới"
          placeholderTextColor={theme.colors.placeholder}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!isNewPasswordVisible}
        />
        <TouchableOpacity onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}>
          <Feather
            name={isNewPasswordVisible ? 'eye-off' : 'eye'}
            size={22}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.passwordContainer, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border }]}>
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder="Xác nhận mật khẩu mới"
          placeholderTextColor={theme.colors.placeholder}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry={!isNewPasswordVisible}
        />
        <TouchableOpacity onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}>
          <Feather
            name={isNewPasswordVisible ? 'eye-off' : 'eye'}
            size={22}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleChangePassword}>
        <Text style={[styles.buttonText, { color: theme.colors.textButton }]}>Xác nhận đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
