import { Alert } from "react-native";
import { db, auth } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  writeBatch, 
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { Transaction } from "../service/transactionService";
import { Category } from "../../contexts/categoryContext";
import { defaultCategories } from "./defaultCategories";

// Hàm thêm giao dịch vào Firebase Cloud
export const addTransactionToCloud = async (transaction: { [key: string]: any }) => {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "users", user.uid, "transactions"), {
    userId: user.uid,
    ...transaction,
    // createdAt: new Date(),
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

export const getTransactionByCategoryIdFromCloud = async (categoryId: string): Promise<Transaction[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const transactionsRef = collection(db, "users", user.uid, "transactions");
    const q = query(transactionsRef, where("category", "==", categoryId));
    const querySnapshot = await getDocs(q);

    const transactions: Transaction[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        ...(data as Omit<Transaction, "id">),
      });
    });

    console.log("🗂️ Giao dịch theo categoryId từ Firestore:", transactions);
    return transactions;
  } catch (error) {
    console.error("❌ Lỗi khi lấy giao dịch theo categoryId từ Firestore:", error);
    return [];
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
  category: {id : string ; name: string; type: string }
): Promise<Category> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Người dùng chưa đăng nhập");

  try {
    const docRef = await addDoc(collection(db, "users", user.uid, "categories"), category);
    Alert.alert('Thành công',"Thêm danh mục thành công!");
    return {
      id: docRef.id,
      name: category.name,
      type: category.type as "income" | "expense", 
    };
  } catch (error : any) {
    Alert.alert('Lỗi',"Lỗi khi thêm danh mục", error.message);
    throw error;
  }
};


export const updateCategoryToCloud = async (id: string, updatedData: { name?: string; type?: string }) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const docRef = doc(db, "users", user.uid, "categories", id);
    await updateDoc(docRef, updatedData);
    Alert.alert('Thành công',"Cập nhật danh mục thành công!");
  } catch (error : any) {
    Alert.alert('Lỗi',"Lỗi khi cập nhật danh mục", error.message);
    throw error;
  }
};

export const deleteCategoryFromCloud = async (id: string) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const docRef = doc(db, "users", user.uid, "categories", id);
    Alert.alert('Thành công',"Xóa danh mục thành công!");
    await deleteDoc(docRef);
  } catch (error : any) {
    Alert.alert('Lỗi',"Lỗi khi xóa danh mục", error.message);
    throw error;
  }
};

export const setMonthlyLimitToCloud = async (
  month: string,
  amountLimit: number
): Promise<void> => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const docRef = doc(db, "users", user.uid, "MonthlyLimit", month);
    await setDoc(docRef, { amountLimit }, { merge: true });

    Alert.alert('Thành công',"Thiết lập hạn mức chi tiêu thành công!");
  } catch (error : any) {
    console.error("❌ Lỗi khi thiết lập hạn mức chi tiêu lên Firestore:", error);
    Alert.alert('Lỗi',"Lỗi khi thiết lập hạn mức chi tiêu", error.message);
    throw error;
  }
};

export const getMonthlyLimitFromCloud = async (month: string): Promise<number | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const docRef = doc(db, "users", user.uid, "MonthlyLimit", month);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.amountLimit ?? null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("❌ Lỗi khi lấy hạn mức tháng từ Firestore:", error);
    throw error;
  }
};

export const deleteMonthlyLimitFromCloud = async (month: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const docRef = doc(db, "users", user.uid, "MonthlyLimit", month);
    await deleteDoc(docRef);
    console.log(`✅ Đã xóa hạn mức chi tiêu cho tháng ${month} khỏi Firestore.`);
  } catch (error) {
    console.error("❌ Lỗi khi xóa hạn mức chi tiêu khỏi Firestore:", error);
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
    console.log("🗂️ Danh mục từ Firestore:", categories);
    return categories;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục", error);
    throw error;
  }
};

export const uploadTransactionToFirebase = async (tx: Transaction, uid: string) => {
  const ref = doc(collection(db, "users", uid, "transactions"));
  await setDoc(ref, tx);
}

export const uploadCategoryToFirebase = async (cat: Category, uid: string) => {
  const ref = doc(collection(db, "users", uid, "categories"));
  await setDoc(ref, cat);
}

export const copyDefaultCategoriesToUser = async (userId: string) => {
  const batch = writeBatch(db);

  defaultCategories.forEach((category) => {
    const userCatRef = doc(db, "users", userId, "categories", category.id);
    batch.set(userCatRef, category);
  });

  await batch.commit();
};



export const fetchUserProfile = async (uid: string): Promise<{ name: string | null }> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        name: data.name || null,
      };
    } else {
      console.log("Không tìm thấy người dùng trong Firestore");
      return { name: null};
    }
  } catch (error) {
    console.error("Lỗi khi lấy user profile:", error);
    return { name: null};
  }
};


export default addTransactionToCloud;
