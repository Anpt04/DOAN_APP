import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useCategories } from "../contexts/categoryContext"; 
import * as categoryService from "../DB/service/categoryService";  
import { Category } from "../contexts/categoryContext";

const CategoryManagerScreen = () => {
  // Sử dụng useCategories để lấy categories và setCategories
  const { categories, setCategories } = useCategories();
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("income");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const allCategories = await categoryService.getAllCategories();
      setCategories(allCategories);  // Cập nhật categories từ Firebase
    };

    if (categories.length === 0) { // Chỉ tải lại nếu chưa có danh mục
        fetchCategories();
      }
  }, []);  // Chỉ gọi lần đầu tiên

  const handleAddCategory = async () => {
    if (!categoryName) {
      Alert.alert("Lỗi", "Vui lòng nhập tên danh mục");
      return;
    }
  
    const newCategory = {
      name: categoryName,
      type: categoryType as "income" | "expense",
    };
  
    try {
      const savedCategory = await categoryService.addCategory(newCategory); // ✅ nhận đúng dữ liệu từ Firebase
      if (savedCategory) {
        setCategories([...categories, savedCategory]);     
        setCategoryName("");                                // ✅ reset form
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };
  

  const handleUpdateCategory = async () => {
    if (!categoryName) {
      Alert.alert("Lỗi", "Vui lòng nhập tên danh mục");
      return;
    }

    if (!editingCategory) {
      Alert.alert("Lỗi", "Không có danh mục nào đang được chỉnh sửa");
      return;
    }

    const updatedCategory = {
      name: categoryName,
      type: categoryType as "income" | "expense",  // Ép kiểu nếu cần
    };

    try {
      await categoryService.updateCategory(editingCategory.id, updatedCategory);
      const updatedCategories = categories.map((cat) =>
        cat.id === editingCategory.id ? { ...cat, ...updatedCategory } : cat
      );
      setCategories(updatedCategories);  // Cập nhật danh mục đã sửa
      setCategoryName("");  // Reset form
      setEditingCategory(null);  // Xóa trạng thái chỉnh sửa
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa danh mục này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            await categoryService.deleteCategory(id);
            setCategories(categories.filter((cat) => cat.id !== id));  // Cập nhật lại danh sách sau khi xóa
          } catch (error) {
            console.error("Error deleting category:", error);
          }
        },
      },
    ]);
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryText}>{item.name} - {item.type}</Text>
      <View style={styles.categoryActions}>
        <TouchableOpacity onPress={() => {
          setEditingCategory(item);
          setCategoryName(item.name);
          setCategoryType(item.type);
        }}>
          <Text style={styles.actionText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteCategory(item.id)}>
          <Text style={styles.actionText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{editingCategory ? "Sửa danh mục" : "Thêm danh mục"}</Text>

      <TextInput
        placeholder="Tên danh mục"
        value={categoryName}
        onChangeText={setCategoryName}
        style={styles.input}
        keyboardType="default" 
        autoCorrect={false} 
      />
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[styles.typeButton, categoryType === "income" && styles.selectedButton]}
          onPress={() => setCategoryType("income")}
        >
          <Text style={styles.buttonText}>Thu nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, categoryType === "expense" && styles.selectedButton]}
          onPress={() => setCategoryType("expense")}
        >
          <Text style={styles.buttonText}>Chi tiêu</Text>
        </TouchableOpacity>
      </View>

      <Button
        title={editingCategory ? "Cập nhật" : "Thêm"}
        onPress={editingCategory ? handleUpdateCategory : handleAddCategory}
      />

      <Text style={styles.subtitle}>Danh sách danh mục</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
    },
    typeSelector: {
      flexDirection: "row",
      marginBottom: 10,
    },
    typeButton: {
      flex: 1,
      padding: 10,
      backgroundColor: "#eee",
      borderRadius: 5,
      alignItems: "center",
      margin: 5,
    },
    selectedButton: {
      backgroundColor: "#4caf50",
    },
    buttonText: {
      color: "#000",
    },
    categoryItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 15,
      backgroundColor: "#f5f5f5",
      marginBottom: 10,
      borderRadius: 5,
    },
    categoryText: {
      fontSize: 16,
    },
    categoryActions: {
      flexDirection: "row",
      alignItems: "center",
    },
    actionText: {
      marginLeft: 10,
      color: "red",
    },
    subtitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 20,
    },
  });

export default CategoryManagerScreen;
