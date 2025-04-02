import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Email:", email);
    console.log("Password:", password);
    alert("ban da dang nhap thanh cong");
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
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
    justifyContent: "center", 
    alignItems: "center", 
    paddingTop: 20,  
    backgroundColor: "rgb(255, 255, 255)" 
},
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20 
},
  input: { 
    width: "90%", 
    padding: 10, 
    borderWidth: 1, 
    borderRadius: 8, 
    marginBottom: 10 
},
  button: { 
    backgroundColor: "blue", 
    padding: 10, 
    borderRadius: 8, 
    width: "60%", 
    alignItems: "center" 
},
  buttonText: { 
    color: "white", 
    fontSize: 16 
},
  link: { 
    color: "blue", 
    marginTop: 10 
  },  
});
