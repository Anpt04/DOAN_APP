import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../DB/firebase/firebaseConfig";
import { useTheme } from "../contexts/themeContext"; // Đảm bảo đường dẫn đúng

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const { theme } = useTheme(); // Lấy theme từ context

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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Quên mật khẩu</Text>
      <Text style={[styles.label, { color: theme.colors.text }]}>Nhập email để đặt lại mật khẩu</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBackground,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          },
        ]}
        placeholder="Email"
        placeholderTextColor={theme.colors.placeholder}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleResetPassword}
      >
        <Text style={[styles.buttonText, { color: theme.colors.textButton }]}>Gửi email khôi phục</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { fontSize: 16, fontWeight: "bold" },
});
