import React, { useState } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from "expo-router";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../DB/firebase/firebaseConfig';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Đăng nhập thành công!');
      // 👉 Điều hướng tới trang chính sau khi đăng nhập thành công
      router.replace('/');
    } catch (error: any) {
      alert('Đăng nhập thất bại');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* Thay thế Button bằng TouchableOpacity */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/Auth/Register")}>
        <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: 'rgb(255, 254, 254)'
  },
  title: { 
    fontSize: 28, 
    marginBottom: 20, 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc', 
    padding: 10, 
    borderRadius: 8,
    marginBottom: 15
  },
  link: { 
    textAlign: "center",
    color: "blue", 
    marginTop: 10 
  },
  button: {
    backgroundColor: 'blue',  // Màu nền cho nút
    padding: 10, 
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center', // Đảm bảo văn bản nằm chính giữa
  },
  buttonText: {
    color: 'white', // Màu chữ của nút
    fontSize: 16,
    fontWeight: 'bold',
  }
});
