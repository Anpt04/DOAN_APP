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
import { useTheme } from "../contexts/themeContext";

const CategoryManagerScreen = () => {
  const { categories, setCategories } = useCategories();
  const { theme } = useTheme();
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("income");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const filteredCategories = categories.filter(cat => cat.type === categoryType);
  
  useEffect(() => {
    const fetchCategories = async () => {
      const allCategories = await categoryService.getAllCategories();
      setCategories(allCategories);
    };

    if (categories.length === 0) {
      fetchCategories();
    }
  }, []);

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
      const savedCategory = await categoryService.addCategory(newCategory);
      if (savedCategory) {
        setCategories([...categories, savedCategory]);
        setCategoryName("");
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
      type: categoryType as "income" | "expense",
    };

    try {
      await categoryService.updateCategory(editingCategory.id, updatedCategory);
      const updatedCategories = categories.map((cat) =>
        cat.id === editingCategory.id ? { ...cat, ...updatedCategory } : cat
      );
      setCategories(updatedCategories);
      setCategoryName("");
      setEditingCategory(null);
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
            setCategories(categories.filter((cat) => cat.id !== id));
          } catch (error) {
            console.error("Error deleting category:", error);
          }
        },
      },
    ]);
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <View
      style={[
        styles.categoryItem,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
    >
      <Text style={[styles.categoryText, { color: theme.colors.text }]}>
        {item.name} 
      </Text>
      <View style={styles.categoryActions}>
        <TouchableOpacity
          onPress={() => {
            setEditingCategory(item);
            setCategoryName(item.name);
            setCategoryType(item.type);
          }}
        >
          <Text style={[styles.actionText, { color: theme.colors.primary }]}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteCategory(item.id)}>
          <Text style={[styles.actionText, { color: theme.colors.danger }]}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text
        style={[
          styles.title,
          { color: theme.colors.text, fontFamily: 'bold' },
        ]}
      >
        {editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
      </Text>

      <TextInput
        placeholder="Tên danh mục"
        placeholderTextColor={theme.colors.placeholder}
        value={categoryName}
        onChangeText={setCategoryName}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBackground,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          },
        ]}
      />

      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            {
              backgroundColor:
                categoryType === "income"
                  ? theme.colors.primary
                  : theme.colors.inputBackground,
            },
          ]}
          onPress={() => setCategoryType("income")}
        >
          <Text
            style={{
              color:
                categoryType === "income"
                  ? theme.colors.textButton
                  : theme.colors.text,
              fontWeight: categoryType === "income" ? "bold" : "normal",
            }}
          >
            Thu nhập
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            {
              backgroundColor:
                categoryType === "expense"
                  ? theme.colors.primary
                  : theme.colors.inputBackground,
            },
          ]}
          onPress={() => setCategoryType("expense")}
          >
          <Text
            style={{
              color:
                categoryType === "expense"
                  ? theme.colors.textButton
                  : theme.colors.text,
                  fontWeight: categoryType === "expense" ? "bold" : "normal",}}
          >
            Chi tiêu
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={editingCategory ? handleUpdateCategory : handleAddCategory}
      >
        <Text style={[styles.buttonText, { color: theme.colors.textButton }]}>
          {editingCategory ? "Cập nhật" : "Thêm"}
        </Text>
      </TouchableOpacity>


      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.text, fontFamily: 'bold' },
        ]}
      >
        Danh sách danh mục
      </Text>
        
      <FlatList
        data={filteredCategories}
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
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
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
    borderRadius: 5,
    alignItems: "center",
    margin: 5,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
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
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 20,
  },
});

export default CategoryManagerScreen;
