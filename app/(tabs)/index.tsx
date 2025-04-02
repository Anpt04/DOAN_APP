import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import PageA from '../2screen/screen1'; // Giả lập trang A
import PageB from '../2screen/screen2'; // Giả lập trang B

export default function App() {
  const [currentPage, setCurrentPage] = useState('PageA');

  return (
    <View style={styles.container}>
      {/* Nút chuyển trang */}
      <View style={styles.header}>
        <Pressable
          onPress={() => setCurrentPage('PageA')}
          style={[
            styles.button,
            styles.leftButton,
            currentPage === 'PageA' && styles.activeButton  // Nếu đang ở PageA thì bo tròn cả 4 góc
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              currentPage === 'PageA' && styles.activeButtonText, // Đổi màu chữ nếu đang ở PageA
            ]}
          >
            Tiền chi
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setCurrentPage('PageB')}
          style={[
            styles.button,
            styles.rightButton,
            currentPage === 'PageB' && styles.activeButton  // Nếu đang ở PageB thì bo tròn cả 4 góc
          ]}

        >
          <Text
            style={[
              styles.buttonText,
              currentPage === 'PageB' && styles.activeButtonText, // Đổi màu chữ nếu đang ở PageB
            ]}
          >
            Tiền thu
          </Text>
        </Pressable>
      </View>

      {/* Hiển thị trang tương ứng */}
      {currentPage === 'PageA' ? <PageA /> : <PageB />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 60,
    backgroundColor: 'rgb(87, 87, 87)',
    borderRadius: 8,
    padding: 2,
  },
  button: {
    backgroundColor: 'rgb(87, 87, 87)', // Màu nền mặc định
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  buttonText: {
    color: 'rgb(250, 246, 246)', // Màu chữ mặc định
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeButton: {
    backgroundColor: '	rgb(255, 255, 255)', // Màu nền đậm khi được chọn
    
  },
  activeButtonText: {
    color: 'rgb(1,1,1)', // Màu chữ trắng khi được chọn
    
  },
  leftButton: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  rightButton: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  
});
