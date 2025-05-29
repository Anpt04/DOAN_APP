import { Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { router } from 'expo-router';

const logout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
  
      // ✅ Quay lại màn hình đăng nhập
      router.replace('/');
      Alert.alert('Thành công','Đăng xuất thành công');
      // Optionally: Thêm thông báo
      // Toast.show({ type: 'success', text1: 'Đăng xuất thành công' });
    } catch (error: any) {
      console.error('Logout error:', error);
      Alert.alert('Thất bại','Đăng xuất thất bại' + error.message);
    }
  };

  export default logout; 