import React, { useState } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import firebaseConfig from '../DB/firebase/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { copyDefaultCategoriesToUser } from '../DB/firebase/firebaseService';


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

const handleSignUp = async () => {
  if (!email || !password || !name) {
    Alert.alert("Lỗi", 'Vui lòng điền đầy đủ thông tin.');
    return;
  }

  if (!isValidEmail(email)) {
    Alert.alert("Lỗi", "Vui lòng nhập địa chỉ email hợp lệ.");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert("Lỗi", 'Mật khẩu không khớp. Vui lòng kiểm tra lại.');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await copyDefaultCategoriesToUser(user.uid);

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: new Date(),
      });

      signOut(auth);

    Alert.alert("Thành công", "Đăng ký thành công, bạn có thể đăng nhập.");
    router.replace("/Auth/Login");

  } catch (error) {
    console.log("Lỗi đăng ký:", error);
    Alert.alert("Lỗi", "Đã có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.");
  }
};

  const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Đăng kí</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#555"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Mật khẩu</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.passwordInput}
          placeholder="Mật khẩu"
          placeholderTextColor="#555"
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Feather 
            name={isPasswordVisible ? 'eye-off' : 'eye'} 
            size={22} 
            color="#555" 
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Xác nhận mật khẩu</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.passwordInput}
          placeholder="Xác nhận mật khẩu"
          placeholderTextColor="#555"
          secureTextEntry={!isConfirmPasswordVisible}
        />
        <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
          <Feather 
            name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} 
            size={22} 
            color="#555" 
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Tên</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Tên"
        placeholderTextColor="#555"
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Đăng kí</Text>
      </TouchableOpacity>
      
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
    backgroundColor: 'rgb(255, 254, 254)'
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 5,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
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

export default SignUpScreen;
