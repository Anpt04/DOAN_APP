import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgb(255, 255, 255)" }}>
      <Text>Home Screen</Text>
      
      {/* Nút điều hướng đến màn hình Chi tiết */}
      <Link href="../Auth/Login" asChild>
        <TouchableOpacity
          style={{
            backgroundColor: "blue",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
            marginTop: 20,
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Đi đến Login</Text>
        </TouchableOpacity>
      </Link>
      <Link href="../Auth/Register" asChild>
        <TouchableOpacity
          style={{
            backgroundColor: "blue",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
            marginTop: 20,
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Đi đến Register</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
