import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { router } from "expo-router";

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null); // Đảm bảo kiểu dữ liệu chính xác

  useEffect(() => {
    // Theo dõi trạng thái đăng nhập của người dùng
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Cập nhật thông tin người dùng khi trạng thái thay đổi
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth); // Đăng xuất người dùng
      router.replace("/"); // Điều hướng về màn hình đăng nhập
    } catch (error) {
      alert("Đăng xuất thất bại");
    }
  };

  return (
    <View style={styles.container}>

      <Link href="../screen/setMonthlyLimitScreen" asChild>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.buttonText}>Hạn mức chi tiêu của tháng</Text>
          </TouchableOpacity>
        </Link>

      {/* Nếu chưa đăng nhập, hiển thị nút Login */}
      {!user && (
        <Link href="../Auth/Login" asChild>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.buttonText}>Đi đến Login</Text>
          </TouchableOpacity>
        </Link>
      )}

      {/* Nút điều hướng đến màn hình Register */}
      {!user && (
        <Link href="../Auth/Register" asChild>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.buttonText}>Đi đến Register</Text>
        </TouchableOpacity>
      </Link>
      )}
      

      {/* Nút Đăng xuất (hiển thị khi đã đăng nhập) */}
      {user && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgb(255, 255, 255)",
    
  },
  
  loginButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
