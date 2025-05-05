import { auth } from "../firebase/firebaseConfig";
import * as LocalService from "../LocalDB/localService";
import * as CloudService from "../firebase/firebaseService";

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
}

// ✅ Thêm danh mục
export const addCategory = async (category: { name: string; type: string }): Promise<Category> => {
  if (auth.currentUser) {
    return await CloudService.addCategoryToCloud(category);
  } else {
    return await LocalService.addCategoryToLocal(category);
  }
};

// 📥 Lấy tất cả danh mục
export const getAllCategories = async (): Promise<Category[]> => {
  if (auth.currentUser) {
    return await CloudService.getAllCategoriesFromCloud();
  } else {
    return await LocalService.getAllCategoriesFromLocal();
  }
};

// ✏️ Cập nhật danh mục
export const updateCategory = async (
  id: string,
  updatedData: { name?: string; type?: string }
) => {
  if (auth.currentUser) {
    await CloudService.updateCategoryToCloud(id, updatedData);
  } else {
    await LocalService.updateCategoryToLocal(id, updatedData);
  }
};

// ❌ Xoá danh mục
export const deleteCategory = async (id: string) => {
  if (auth.currentUser) {
    await CloudService.deleteCategoryFromCloud(id);
  } else {
    await LocalService.deleteCategoryFromLocal(id);
  }
};

export default {
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
