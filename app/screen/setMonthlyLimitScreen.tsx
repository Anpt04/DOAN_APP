import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { setMonthlyLimits, getMonthlyLimits } from "../DB/service/transactionService";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';

export default function MonthlyLimitScreen() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // "YYYY-MM"
  const [amount, setAmount] = useState("");
  const [savedLimit, setSavedLimit] = useState<number | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    const fetchLimit = async () => {
      try {
        const limit = await getMonthlyLimits(month);
        setSavedLimit(limit);
      } catch (error) {
        console.error("Lỗi khi lấy hạn mức:", error);
        setSavedLimit(null);
      }
    };

    fetchLimit();
  }, [month]);

  const handleSave = async () => {
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    try {
      await setMonthlyLimits(month, amountNumber);
      Alert.alert("Thành công", `Đã thiết lập hạn mức cho tháng ${month}`);
      setAmount("");
      setSavedLimit(amountNumber); // cập nhật lại sau khi lưu
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu hạn mức. Vui lòng thử lại.");
      console.error("Error saving monthly limit:", error);
    }
  };

  const handleDateChange = (date: Date) => {
    const formattedDate = date.toISOString().slice(0, 7); // "YYYY-MM"
    setMonth(formattedDate);
    setDatePickerVisibility(false);
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    const currentDate = new Date(month);
    if (direction === "prev") {
      currentDate.setMonth(currentDate.getMonth() - 1);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    setMonth(currentDate.toISOString().slice(0, 7)); // "YYYY-MM"
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tháng (YYYY-MM):</Text>

      <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={() => handleMonthChange("prev")} style={styles.arrowButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.input}>
          <Text>{month}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleMonthChange("next")} style={styles.arrowButton}>
          <Ionicons name="arrow-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={new Date(`${month}-01`)}
        display="spinner"
        onConfirm={handleDateChange}
        onCancel={() => setDatePickerVisibility(false)}
        maximumDate={new Date()}
      />

      <Text style={styles.label}>Hạn mức chi tiêu (₫):</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Nhập số tiền"
      />

      <Text style={styles.savedLimitText}>
        Hạn mức đã lưu: {savedLimit !== null ? `${savedLimit.toLocaleString()} ₫` : "Chưa có"}
      </Text>

      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={{ color: "#fff", fontSize: 18 }}>Lưu hạn mức</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { fontSize: 16, marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  arrowButton: {
    padding: 10,
  },
  savedLimitText: {
    fontSize: 16,
    marginTop: 20,
    color: "green",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
});
