import { getAuth, signOut } from 'firebase/auth';
import { router } from 'expo-router';

const logout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
  
      // ✅ Quay lại màn hình đăng nhập
      router.replace('/');
      alert('Đăng xuất thành công');
      // Optionally: Thêm thông báo
      // Toast.show({ type: 'success', text1: 'Đăng xuất thành công' });
    } catch (error) {
      console.error('Logout error:', error);
      alert('Đăng xuất thất bại');
    }
  };

  export default logout; 