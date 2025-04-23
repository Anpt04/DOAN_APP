import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addTransaction } from "../DB/service/transactionService";
import { useCategories } from "../contexts/categoryContext";

const AddTransactionScreen: React.FC = () => {
  const { categories } = useCategories();
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (categories.length > 0) {
      setCategory(categories[0].id);
    }
  }, [categories]);

  const handleAdd = async () => {
    if (amount === 0 || isNaN(amount)) {
      alert("Số tiền không thể bằng 0");
      return; 
    }
 
    const selectedCategory = categories.find((cat) => cat.id === category);

    // Đổi ngày sang định dạng yyyy-MM-dd
    const formattedDate = date
      .toLocaleDateString('en-GB') // Lấy ngày theo định dạng dd/mm/yyyy
      .split('/')
      .reverse()
      .join('-'); // Đổi sang định dạng yyyy-MM-dd
  
    const transaction = {
      type: "income",
      category: selectedCategory?.id || "",
      categoryName: selectedCategory?.name || "",
      amount: parseFloat(amount.toString()),
      date: formattedDate, // Lưu theo định dạng yyyy-MM-dd
      note,
    };
  
    alert("Thêm giao dịch thành công!");
    await addTransaction(transaction);
    setAmount(0);
    setNote("");
  };
  

  const onChangeDate = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Thêm khoản thu</Text>

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>📅 {date.toLocaleDateString("vi-VN")}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <TextInput
        placeholder="Ghi chú"
        placeholderTextColor="#555" 
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <TextInput
        placeholder="Số tiền"
        placeholderTextColor="#555"
        keyboardType="number-pad"
        value={
          amount === 0 || isNaN(amount)
            ? ""
            : amount.toLocaleString("en-US") // Hiển thị có dấu phẩy
        }
        onChangeText={(text) => {
          const raw = text.replace(/,/g, ""); // Xóa dấu phẩy người dùng nhập
          const newAmount = parseFloat(raw);
          setAmount(isNaN(newAmount) ? 0 : newAmount);
        }}
        style={styles.input}
      />

      <Text style={styles.label}>Chọn danh mục:</Text>
      <View style={styles.categoryList}>
        {categories
          .filter((cat) => cat.type === "income")
          .map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryButton,
                category === cat.id && styles.selectedCategory,
              ]}
              onPress={() => setCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat.id && styles.selectedCategoryText,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.categoryButton]}  onPress={() => router.push('/screen/editCategory')}>
                      <Text style={[styles.categoryText, { color: "rgb(1,1,1)" }]}>Khác</Text>
          </TouchableOpacity>          
      </View>

      
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Thêm giao dịch</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    padding: 20,
    backgroundColor: "rgb(255, 255, 255)",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: "rgb(1,1,1)",
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedCategory: {
    backgroundColor: "#4caf50",
  },
  categoryText: {
    color: "#000",
  },
  selectedCategoryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddTransactionScreen;
