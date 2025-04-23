import { db, auth } from "./firebaseConfig";
import {
  DocumentReference,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import { Transaction } from "../service/transactionService";
import { Category } from "../../contexts/categoryContext"; // Cập nhật đường dẫn nếu khác

// Hàm thêm giao dịch vào Firebase Cloud
export const addTransactionToCloud = async (transaction: { [key: string]: any }) => {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "users", user.uid, "transactions"), {
    userId: user.uid,
    ...transaction,
    createdAt: new Date(),
  });
};

export const getTransactionsFromCloud = async (): Promise<Transaction[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  const transactionsRef = collection(db, "users", user.uid, "transactions");
  const snapshot = await getDocs(transactionsRef);

  const transactions: Transaction[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      type: data.type,
      category: data.category,
      categoryName: data.categoryName,
      amount: data.amount,
      date: data.date,
      note: data.note || '',
    };
  });

  return transactions;
};

export const getTransactionByIdFromCLoud = async (id: string): Promise<Transaction | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const docRef = doc(db, "users", user.uid, "transactions", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...(data as Omit<Transaction, "id">),
      };
    } else {
      console.log("Giao dịch không tồn tại");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy giao dịch:", error);
    return null;
  }
};

export const updateTransactionToCloud = async (id: string, newData: any) => {
  const user = auth.currentUser;
  if (!user) return;
  const ref = doc(db, "users", user.uid, "transactions", id);
  await updateDoc(ref, newData);
};

export const deleteTransactionFromCloud = async (id: string) => {
  const user = auth.currentUser;
  if (!user) return;
  const docRef = doc(db, "users", user.uid, "transactions", id);
  await deleteDoc(docRef);
};

export const addCategoryToCloud = async (
  category: { name: string; type: string }
): Promise<Category> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Người dùng chưa đăng nhập");

  try {
    const docRef = await addDoc(collection(db, "users", user.uid, "categories"), category);
    alert("Thêm danh mục thành công!");
    return {
      id: docRef.id,
      name: category.name,
      type: category.type as "income" | "expense", 
    };
  } catch (error) {
    alert("Lỗi khi thêm danh mục");
    throw error;
  }
};


export const updateCategoryToCloud = async (id: string, updatedData: { name?: string; type?: string }) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const docRef = doc(db, "users", user.uid, "categories", id);
    await updateDoc(docRef, updatedData);
    alert("Cập nhật danh mục thành công!");
  } catch (error) {
    alert("Lỗi khi cập nhật danh mục");
    throw error;
  }
};

export const deleteCategoryFromCloud = async (id: string) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const docRef = doc(db, "users", user.uid, "categories", id);
    alert("Xóa danh mục thành công!");
    await deleteDoc(docRef);
  } catch (error) {
    alert("Lỗi khi xóa danh mục");
    throw error;
  }
};

export const getAllCategoriesFromCloud = async (): Promise<Category[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const userCategoryCollection = collection(db, "users", user.uid, "categories");
    const querySnapshot = await getDocs(userCategoryCollection);
    const categories: Category[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name as string,
        type: data.type as "income" | "expense",
      };
    });
    return categories;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục", error);
    throw error;
  }
};

export const copyDefaultCategoriesToUser = async (userId: string) => {
  const defaultCategoriesSnap = await getDocs(collection(db, "default_categories"));

  const batch = writeBatch(db);
  defaultCategoriesSnap.forEach((docSnap) => {
    const categoryData = docSnap.data();
    const userCatRef = doc(db, "users", userId, "categories", docSnap.id);
    batch.set(userCatRef, categoryData);
  });

  await batch.commit();
};

export default addTransactionToCloud;
