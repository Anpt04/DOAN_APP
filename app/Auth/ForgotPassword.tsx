import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../DB/firebase/firebaseConfig"; // file cấu hình firebase của bạn

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleResetPassword = async () => {
    if (!isValidEmail(email)) {
      Alert.alert("Lỗi", "Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Thành công", "Email đặt lại mật khẩu đã được gửi.");
    } catch (error: any) {
      console.error("❌ Lỗi gửi email đặt lại mật khẩu:", error);
      Alert.alert("Lỗi", error.message || "Không thể gửi email đặt lại mật khẩu.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>
      <Text style={styles.label}>Nhập email để đặt lại mật khẩu</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#555"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Gửi email khôi phục</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
});
