import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { CategoryProvider } from './contexts/categoryContext'; 
import { initDatabase } from './DB/LocalDB/localDB';
import { useColorScheme } from '@/hooks/useColorScheme';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const setup = async () => {
      try {
        await initDatabase(); 
        console.log('Database initialized successfully');
      } catch (e) {
        console.error('DB setup failed:', e);
      }
    };
    setup();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CategoryProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="Auth/Login" options={{ headerShown: true, title: 'Đăng nhập', headerTitleAlign: 'center' }} />
        <Stack.Screen name="Auth/Register" options={{ headerShown: true, title: 'Đăng ký', headerTitleAlign: 'center' }} />
        <Stack.Screen name="screen/editCategory" options={{ headerShown: true, title: 'Thêm mới danh mục', headerTitleAlign: 'center' }} />
        <Stack.Screen name="screen/editTransactionScreen" options={{ headerShown: true, title: 'Chỉnh sửa giao dịch', headerTitleAlign: 'center' }} />
        <Stack.Screen name="screen/reportTransaction/reportDetail" options={{ headerShown: true, title: 'Chi tiết', headerTitleAlign: 'center' }} />

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      </CategoryProvider>
      </ThemeProvider>
  );
}
