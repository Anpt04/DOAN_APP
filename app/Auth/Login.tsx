import React, { useState } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from "expo-router";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../DB/firebase/firebaseConfig';
import { useCategories } from "../contexts/categoryContext";
import { collection, getDocs } from 'firebase/firestore'; // ⬅️ Thêm dòng này
import { db } from '../DB/firebase/firebaseConfig';        // ⬅️ Thêm dòng này



export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setCategories } = useCategories(); // ⬅️ Lấy hàm từ context


  const handleLogin = async () => {
    if (!email || !password) {
      alert('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

    // ✅ Lấy danh mục từ Firestore
    const catRef = collection(db, "users", user.uid, "categories");
    const snapshot = await getDocs(catRef);
    const catList = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      type: doc.data().type,
    }));
    setCategories(catList); // ✅ Lưu vào context

      alert('Đăng nhập thành công!');
      router.replace('/');
    } catch (error: any) {
      alert('Đăng nhập thất bại');
    }
  };

  return (
    <View style={styles.container}>
      {/* Thêm logo từ URL */}
      <Image 
        source={require('../../assets/images/logo.png')}  // Thay bằng URL hình ảnh thực tế
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Đăng Nhập</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#555" 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Mật khẩu"
        placeholderTextColor="#555" 
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

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
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 5,
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
    backgroundColor: 'blue',
    padding: 10, 
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
