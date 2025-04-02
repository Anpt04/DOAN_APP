import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Trường xác nhận mật khẩu

  const handleRegister = () => {
    if (password !== confirmPassword) {
      // Nếu mật khẩu và xác nhận mật khẩu không khớp
      Alert.alert("Lỗi", "Mật khẩu và mật khẩu xác nhận không khớp!");
      return;
    }

    // Nếu tất cả hợp lệ, thực hiện đăng ký
    console.log("Đăng ký thành công!");
    router.replace("/Auth/Login"); // Chuyển về trang login sau khi đăng ký
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Ký</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng Ký</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/Auth/Login")}>
        <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20,  backgroundColor: "rgb(255, 255, 255)" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", padding: 10, borderWidth: 1, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: "green", padding: 10, borderRadius: 8, width: "100%", alignItems: "center" },
  buttonText: { color: "white", fontSize: 16 },
  link: { color: "blue", marginTop: 10 },
});
