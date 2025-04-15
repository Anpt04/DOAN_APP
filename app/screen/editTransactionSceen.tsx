import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getTransactionById, updateTransactionToCloud, deleteTransaction } from "../DB/firebase/firebaseService";
import { useCategories } from "../contexts/categoryContext";


const EditTransactionScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { categories } = useCategories();

  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState<"expense" | "income">();
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const data = await getTransactionById(id);
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
      alert("Số tiền không hợp lệ!");
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

    await updateTransactionToCloud(id, updated);
    alert("Cập nhật thành công!");
    router.back();
  };

  const handleDelete = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa giao dịch này?", [
      { text: "Hủy" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          await deleteTransaction(id);
          alert("Đã xóa giao dịch!");
          router.back();
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
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa giao dịch</Text>

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
        value={amount === 0 || isNaN(amount) ? "" : amount.toString()}
        onChangeText={(text) => {
          const newAmount = parseFloat(text);
          setAmount(isNaN(newAmount) ? 0 : newAmount);
        }}
        style={styles.input}
      />

      <Text style={styles.label}>Chọn danh mục:</Text>
      <View style={styles.categoryList}>
        {categories
          .filter((cat) => cat.type === type)
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
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>💾 Lưu chỉnh sửa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>🗑️ Xóa giao dịch</Text>
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
    backgroundColor: "#fff",
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
    color: "#000",
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
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
