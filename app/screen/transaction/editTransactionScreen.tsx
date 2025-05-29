import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as transactionService from "../../DB/service/transactionService";
import { useCategories } from "../../contexts/categoryContext";
import { useTheme } from "../../contexts/themeContext";

const EditTransactionScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { categories } = useCategories();
  const { theme } = useTheme();

  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState<"expense" | "income">();
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const data = await transactionService.getTransactionById(id);
      if (data) {
        setAmount(data.amount);
        setNote(data.note || "");
        setCategory(data.category);
        setDate(new Date(data.date));
        setType(data.type as "expense" | "income");
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    if (amount <= 0 || isNaN(amount)) {
      Alert.alert("Lỗi", "Số tiền không hợp lệ!");
      return;
    }

    const selectedCategory = categories.find((cat) => cat.id === category);
    const updated = {
      amount,
      note,
      date: date.toISOString(),
      category: selectedCategory?.id || "",
      categoryName: selectedCategory?.name || "",
      type,
    };

    await transactionService.updateTransaction(id, updated);
    Alert.alert("Thành công", "Cập nhật thành công!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const handleDelete = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa giao dịch này?", [
      { text: "Hủy" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          await transactionService.deleteTransaction(id);
          Alert.alert("Thành công", "Đã xóa giao dịch!", [
            { text: "OK", onPress: () => router.back() },
          ]);
        },
      },
    ]);
  };

  const onChangeDate = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Chỉnh sửa giao dịch</Text>

      <TouchableOpacity
        style={[styles.dateButton, { backgroundColor: theme.colors.inputBackground }]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={[styles.dateText, { color: theme.colors.text }]}>
          📅 {date.toLocaleDateString("vi-VN")}
        </Text>
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
        placeholderTextColor={theme.colors.placeholder}
        value={note}
        onChangeText={setNote}
        style={[styles.input, { backgroundColor: theme.colors.inputBackground, color: theme.colors.text }]}
      />

      <TextInput
        placeholder="Số tiền"
        placeholderTextColor={theme.colors.placeholder}
        keyboardType="number-pad"
        value={amount === 0 || isNaN(amount) ? "" : amount.toLocaleString("en-US")}
        onChangeText={(text) => {
          const raw = text.replace(/,/g, "");
          const newAmount = parseFloat(raw);
          setAmount(isNaN(newAmount) ? 0 : newAmount);
        }}
        style={[styles.input, { backgroundColor: theme.colors.inputBackground, color: theme.colors.text }]}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Chọn danh mục:</Text>
      <View style={styles.categoryList}>
        {categories
          .filter((cat) => cat.type === type)
          .map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: category === cat.id ? theme.colors.primary : theme.colors.inputBackground,
                },
              ]}
              onPress={() => setCategory(cat.id)}
            >
              <Text
                style={{
                  color: category === cat.id ? theme.colors.textButton : theme.colors.text,
                  fontWeight: category === cat.id ? "bold" : "normal",
                }}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleUpdate}
      >
        <Text style={[styles.buttonText, { color: theme.colors.textButton }]}>💾 Lưu chỉnh sửa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: theme.colors.danger }]}
        onPress={handleDelete}
      >
        <Text style={[styles.buttonText, { color: theme.colors.textButton }]}>🗑️ Xóa giao dịch</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditTransactionScreen;

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
    marginTop: 10,
  },
  deleteButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
