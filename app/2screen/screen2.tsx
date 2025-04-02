import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PageB() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Đây là Trang tiền thu</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    
    justifyContent: 'center',
    alignItems: 'center' 
  },
  text: { 
    fontSize: 20, 
    fontWeight: 'bold',
    color: 'rgb(255, 255, 255)'  // Màu sắc có thể thay đổi theo yêu cầu 
  },
});
