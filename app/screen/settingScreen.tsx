import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useTheme } from "../contexts/themeContext";
import logout from "../Auth/Logout";
import { fetchUserProfile } from "../DB/firebase/firebaseService";

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>("");
  const router = useRouter();

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const profile = await fetchUserProfile(currentUser.uid);
        setUsername(profile.name || "");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {user ? `Xin chào, ${username || "Người dùng"}` : "Chào mừng bạn đến với ứng dụng"}
      </Text>

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} 
          onPress={() => router.push("../screen/setMonthlyLimitScreen")}>
          <Text style={[styles.buttonText, { color: theme.colors.textButton }]}>Hạn mức chi tiêu của tháng</Text>
        </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={toggleTheme}>
        <Text style={[styles.buttonText, { color: theme.colors.textButton }]}>Đổi Theme</Text>
      </TouchableOpacity>

      {!user && (
        <>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]}
             onPress={() => router.push("../Auth/Login")}>
              <Text style={[styles.buttonText, { color: theme.colors.textButton }]}>Đi đến đăng nhập</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={() => router.push("../Auth/Register")}>
              <Text style={[styles.buttonText, { color: theme.colors.textButton }]}>Đi đến đăng ký</Text>
            </TouchableOpacity>
          
        </>
      )}

      {user && (
        <>
          
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={() => router.push("../Auth/changePassword")}>
              <Text style={[styles.buttonText, { color: theme.colors.textButton }]}>Đổi mật khẩu</Text>
            </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.danger, marginTop: 20 }]}
            onPress={handleLogout}
          >
            <Text style={[styles.buttonText, { color: theme.colors.textButton }]}>Đăng xuất</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    width: "100%",
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});
