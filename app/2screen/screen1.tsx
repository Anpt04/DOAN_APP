import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function App() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return `${date.toLocaleDateString('vi-VN', { weekday: 'long' })}, ${date.toLocaleDateString('vi-VN')}`;
  };
  

  // Giảm ngày
  const decreaseDate = () => {
    setDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 1)));
  };

  // Tăng ngày
  const increaseDate = () => {
    setDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1)));
  };

  return (
    <View style={styles.container}>
      {/* Hàng chứa mũi tên, nút bấm và ngày đã chọn */}
      <View style={styles.row}>
      <Text style={styles.dateText}>Ngày</Text>
        {/* Nút giảm ngày */}
        <Pressable style={styles.arrowButton} onPress={decreaseDate}>
          <Text style={styles.arrowText}>◀</Text>
        </Pressable>

        {/* Nút chọn ngày */}
        <Pressable style={styles.button} onPress={() => setDatePickerVisibility(true)}>
        <Text style={styles.buttonText}>{formatDate(date)}</Text>
        </Pressable>

        {/* Nút tăng ngày */}
        <Pressable style={styles.arrowButton} onPress={increaseDate}>
          <Text style={styles.arrowText}>▶</Text>
        </Pressable>
      </View>

      {/* DateTimePicker */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(selectedDate) => {
          setDate(selectedDate);
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </View>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 8,
    paddingHorizontal: 8,
    width: '100%', // Chiếm toàn bộ chiều rộng
  },
  row: {
    flexDirection: 'row', // Căn ngang
    alignItems: 'center', // Căn giữa theo chiều dọc
    justifyContent: 'center', // Căn giữa
  },
  button: {
    backgroundColor: 'rgb(221, 221, 221)',
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 10, // Khoảng cách với mũi tên
  },
  buttonText: {
    color: 'rgb(0, 0, 0)', // Màu chữ
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrowButton: {
    padding: 10,
  },
  arrowText: {
    fontSize: 20,
    color: 'black',
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 5,
    color: 'black',
  },

});

