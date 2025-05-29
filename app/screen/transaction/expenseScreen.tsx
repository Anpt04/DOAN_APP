import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import { addTransaction } from "../../DB/service/transactionService";
import { useCategories } from "../../contexts/categoryContext";
import { useTheme } from "../../contexts/themeContext";

const AddTransactionScreen: React.FC = () => {
  const { categories } = useCategories();
  const { theme } = useTheme();

  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const expenseList = categories.filter(cat => cat.type === "expense");
    if (expenseList.length > 0) {
      setCategory(expenseList[0].id);
    }
  }, [categories]);

  const handleAdd = async () => {
    if (amount === 0 || isNaN(amount)) {
      Alert.alert("Lỗi", "Số tiền không thể bằng 0");
      return;
    }

    const selectedCategory = categories.find((cat) => cat.id === category);

    const formattedDate = date
      .toLocaleDateString('en-GB')
      .split('/')
      .reverse()
      .join('-');

    const transaction = {
      type: "expense",
      category: selectedCategory?.id || "",
      categoryName: selectedCategory?.name || "",
      amount: parseFloat(amount.toString()),
      date: formattedDate,
      note,
    };

    Alert.alert("Thành công", "Thêm giao dịch thành công!");
    await addTransaction(transaction);
    setAmount(0);
    setNote("");
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Thêm khoản chi</Text>

      <TouchableOpacity style={[styles.dateButton, { backgroundColor: theme.colors.card }]} onPress={() => setShowDatePicker(true)}>
        <Text style={[styles.dateText, { color: theme.colors.text }]}>📅 {date.toLocaleDateString("vi-VN")}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={onChangeDate}
        />
      )}

      <TextInput
        placeholder="Ghi chú"
        placeholderTextColor={theme.colors.placeholder}
        value={note}
        onChangeText={setNote}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          },
        ]}
      />

      <TextInput
        placeholder="Số tiền"
        placeholderTextColor={theme.colors.placeholder}
        keyboardType="number-pad"
        value={
          amount === 0 || isNaN(amount)
            ? ""
            : amount.toLocaleString("en-US")
        }
        onChangeText={(text) => {
          const raw = text.replace(/,/g, "");
          const newAmount = parseFloat(raw);
          setAmount(isNaN(newAmount) ? 0 : newAmount);
        }}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          },
        ]}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Chọn danh mục:</Text>
      <View style={styles.categoryList}>
        {categories
          .filter((cat) => cat.type === "expense")
          .map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryButton,
                {
                  backgroundColor:
                    category === cat.id ? theme.colors.primary : theme.colors.card,
                },
              ]}
              onPress={() => setCategory(cat.id)}
            >
              <Text
                style={{
                  color:
                    category === cat.id
                      ? theme.colors.textButton
                      : theme.colors.text,
                  fontWeight: category === cat.id ? "bold" : "normal",
                }}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}

        <TouchableOpacity
          style={[styles.categoryButton, { backgroundColor: theme.colors.card }]}
          onPress={() => router.push('/screen/editCategory')}
        >
          <Text style={{ color: theme.colors.text }}>Khác</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleAdd}>
        <Text style={[styles.buttonText, { color: theme.colors.textButton }]}>Thêm giao dịch</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    padding: 20,
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
  },
  dateButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
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
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddTransactionScreen;
