import React, { useState } from 'react';
import {
  View, TextInput, Text, Alert, StyleSheet, TouchableOpacity, Image, useColorScheme,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import * as ImagePicker from 'expo-image-picker';

import firebaseConfig from '../DB/firebase/firebaseConfig';
import { copyDefaultCategoriesToUser, uploadCategoryToFirebase, uploadTransactionToFirebase } from '../DB/firebase/firebaseService';
import { getTransactionsFromLocal, getAllCategoriesFromLocal } from '../DB/LocalDB/localService';
import { useTheme } from '../contexts/themeContext';

const app = initializeApp(firebaseConfig);

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  const { theme } = useTheme(); // 👈 sử dụng theme

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp. Vui lòng kiểm tra lại.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email: user.email,
        createdAt: new Date(),
      });

      Alert.alert(
        'Đồng bộ dữ liệu',
        'Bạn có muốn tải dữ liệu hiện tại đang lưu trên máy lên tài khoản cloud không?',
        [
          {
            text: 'Không',
            style: 'cancel',
            onPress: () => {
              copyDefaultCategoriesToUser(user.uid);
              Alert.alert('Thành công', 'Đăng ký thành công.');
              signOut(auth);
              router.replace('/Auth/Login');
            },
          },
          {
            text: 'Có',
            onPress: async () => {
              const localTransactions = await getTransactionsFromLocal();
              const localCategories = await getAllCategoriesFromLocal();

              for (const cat of localCategories) {
                await uploadCategoryToFirebase(cat, user.uid);
              }

              for (const tx of localTransactions) {
                await uploadTransactionToFirebase(tx, user.uid);
              }

              Alert.alert('Thành công', 'Đăng ký và đồng bộ dữ liệu thành công.');
              signOut(auth);
              router.replace('/Auth/Login');
            },
          },
        ]
      );
    } catch (error: any) {
      console.log('Lỗi đăng ký:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra trong quá trình đăng ký.\n' + error.message);
    }
  };

  const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={[styles.title, { color: theme.colors.text }]}>Đăng kí</Text>

      <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { backgroundColor: theme.colors.inputBackground, color: theme.colors.text }]}
        placeholder="Email"
        placeholderTextColor={theme.colors.placeholder}
        keyboardType="email-address"
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Mật khẩu</Text>
      <View style={[styles.passwordContainer, { backgroundColor: theme.colors.inputBackground }]}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={[styles.passwordInput, { color: theme.colors.text }]}
          placeholder="Mật khẩu"
          placeholderTextColor={theme.colors.placeholder}
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

      <Text style={[styles.label, { color: theme.colors.text }]}>Xác nhận mật khẩu</Text>
      <View style={[styles.passwordContainer, { backgroundColor: theme.colors.inputBackground }]}>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={[styles.passwordInput, { color: theme.colors.text }]}
          placeholder="Xác nhận mật khẩu"
          placeholderTextColor={theme.colors.placeholder}
          secureTextEntry={!isConfirmPasswordVisible}
        />
        <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
          <Feather
            name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
            size={22}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.label, { color: theme.colors.text }]}>Tên</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={[styles.input, { backgroundColor: theme.colors.inputBackground, color: theme.colors.text }]}
        placeholder="Tên"
        placeholderTextColor={theme.colors.placeholder}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleSignUp}>
        <Text style={[styles.buttonText, { color: theme.colors.textButton }]}>Đăng kí</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/Auth/Login')}>
        <Text style={[styles.link, { color: theme.colors.link }]}>Đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 5,
    borderRadius: 75,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SignUpScreen;
