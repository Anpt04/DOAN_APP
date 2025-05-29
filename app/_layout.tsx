import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { CategoryProvider } from './contexts/categoryContext';
import { initDatabase } from './DB/LocalDB/localDB';
import { ThemeProvider, useTheme } from './contexts/themeContext';

SplashScreen.preventAutoHideAsync();

function MainStack() {
  const { theme } = useTheme();

  return (
    <CategoryProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.backgroundTitle,
            borderBottomColor: theme.colors.border,
          },
          headerTintColor: theme.colors.text,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: theme.fonts.bold.fontFamily,
            fontWeight: 'bold',
          },
          // Có thể thêm các style chung khác nếu muốn
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="Auth/Login" options={{ title: 'Đăng nhập' }} />
        <Stack.Screen name="Auth/ForgotPassword" options={{ title: 'Quên mật khẩu' }} />
        <Stack.Screen name="Auth/Register" options={{ title: 'Đăng ký' }} />
        <Stack.Screen name="Auth/changePassword" options={{ title: '' }} />

        <Stack.Screen name="screen/editCategory" options={{ title: 'Thêm mới danh mục' }} />
        <Stack.Screen name="screen/transaction/editTransactionScreen" options={{ title: 'Chỉnh sửa giao dịch' }} />
        <Stack.Screen name="screen/reportTransaction/reportDetail" options={{title: 'Chi tiết',}} />
        <Stack.Screen name="screen/setMonthlyLimitScreen" options={{ title: 'Hạn mức chi tiêu' }} />

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
    </CategoryProvider>
  );
}

export default function RootLayout() {
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

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <MainStack />
    </ThemeProvider>
  );
}
