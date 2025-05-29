import React, { useState } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from "expo-router";
import { Feather } from '@expo/vector-icons'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../DB/firebase/firebaseConfig';
import { useCategories } from "../contexts/categoryContext";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../DB/firebase/firebaseConfig';
import { useTheme } from '../contexts/themeContext'; 
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { setCategories } = useCategories();

  const { theme, toggleTheme, isDark } = useTheme(); 

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi','Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const catRef = collection(db, "users", user.uid, "categories");
      const snapshot = await getDocs(catRef);
      const catList = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        type: doc.data().type,
      }));
      setCategories(catList);

      Alert.alert('Thành công','Đăng nhập thành công!');
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Thất bại','Đăng nhập thất bại');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <Image 
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={[styles.title, { color: theme.colors.text }]}>Đăng Nhập</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={theme.colors.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[styles.input, { 
          borderColor: theme.colors.border, 
          backgroundColor: theme.colors.inputBackground,
          color: theme.colors.text,
        }]}
      />

      <View style={[styles.passwordContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.inputBackground }]}>
        <TextInput
          placeholder="Mật khẩu"
          placeholderTextColor={theme.colors.placeholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          style={[styles.passwordInput, { color: theme.colors.text }]}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Feather 
            name={isPasswordVisible ? 'eye-off' : 'eye'} 
            size={24} 
            color={theme.colors.textButton} 
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.colors.primary }]} 
        onPress={handleLogin}
      >
        <Text style={[styles.buttonText, { color: theme.colors.textButton }]}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/Auth/Register")}>
        <Text style={[styles.link, { color: theme.colors.link }]}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/Auth/ForgotPassword")}>
        <Text style={[styles.link, { color: theme.colors.link }]}>Quên mật khẩu ?</Text>
      </TouchableOpacity>
    </View>
  );
}

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
    fontSize: 28, 
    marginBottom: 20, 
    textAlign: 'center', 
    fontWeight: 'bold',
    marginTop: 5, 
  },
  input: {
    borderWidth: 1,
    padding: 10, 
    borderRadius: 8,
    marginBottom: 15
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
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
    textAlign: "center",
    marginTop: 10 
  },
});
