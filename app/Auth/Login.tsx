import React, { useState } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from "expo-router";
import { Feather } from '@expo/vector-icons'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../DB/firebase/firebaseConfig';
import { useCategories } from "../contexts/categoryContext";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../DB/firebase/firebaseConfig';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // 👈 thêm state
  const { setCategories } = useCategories();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Vui lòng nhập đầy đủ email và mật khẩu.');
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

      alert('Đăng nhập thành công!');
      router.replace('/');
    } catch (error: any) {
      alert('Đăng nhập thất bại');
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/logo.png')}
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

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Mật khẩu"
          placeholderTextColor="#555"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          style={styles.passwordInput}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Feather 
            name={isPasswordVisible ? 'eye-off' : 'eye'} 
            size={24} 
            color="#555" 
          />
        </TouchableOpacity>
      </View>

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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },
  eyeIcon: {
    fontSize: 22,
    marginLeft: 10,
    color: '#555',
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
  },
  link: { 
    textAlign: "center",
    color: "blue", 
    marginTop: 10 
  },
});
