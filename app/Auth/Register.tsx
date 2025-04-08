import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import firebaseConfig  from '../DB/firebase/firebaseConfig';  // Đảm bảo cấu hình Firebase
import { copyDefaultCategoriesToUser } from '../DB/firebase/firebaseService';

// Khởi tạo Firebase
import { initializeApp } from 'firebase/app'; 
const app = initializeApp(firebaseConfig);

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const auth = getAuth();
  const db = getFirestore();

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      alert('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    

    try {
      // Đăng ký người dùng với Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;// Lưu thông tin người dùng
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email: user.email,
        password,
        createdAt: new Date(),
      });
      
      // Thêm category mặc định
      await copyDefaultCategoriesToUser(user.uid);
      

      // // Lưu thông tin người dùng vào Firestore
      // await setDoc(doc(db, 'users', user.uid), {
      //   name,
      //   email: user.email,
      //   password,
      //   createdAt: new Date(),
      // });

    alert('Account created successfully');
    router.replace("./Login");
    } catch (error) {
      console.error(error);
      alert('An error occurred during sign-up');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng kí</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Mật khẩu</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
      />
      <Text style={styles.label}>Xác nhận mật khẩu</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
      />

      <Text style={styles.label}>Tên</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Tên"
      />

      <Button title="Đăng kí" onPress={handleSignUp} color="blue" />
      <TouchableOpacity onPress={() => router.push("/Auth/Login")}>
              <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 20,
  },
  link: { 
    textAlign: "center",
    color: "blue", 
    marginTop: 10 
  },  
});

export default SignUpScreen;
