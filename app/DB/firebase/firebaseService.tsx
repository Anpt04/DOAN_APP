import { db, auth } from "./firebaseConfig";
import { DocumentReference, collection, addDoc, getDocs, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { Transaction } from "../transactionService";
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

export const getTransactionsFromCloud = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const transactionsRef = collection(db, "users", user.uid, "transactions");
  const snapshot = await getDocs(transactionsRef);

  const transactions = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return transactions;
};

export const getTransactionById = async (id: string): Promise<Transaction | null> => {
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

export const deleteTransaction = async (id: string) => {
  const user = auth.currentUser;
  if (!user) return;
  const docRef = doc(db, "users", user.uid, "transactions", id);
  await deleteDoc(docRef);
};

// Hàm sao chép category mặc định cho user mới
export const copyDefaultCategoriesToUser = async (userId: string) => {
  const defaultCategoriesSnap = await db.collection("default_categories").get();

  const batch = db.batch();
  defaultCategoriesSnap.forEach((docSnap) => {
    const categoryData = docSnap.data();
    const userCatRef = db
      .collection("users")
      .doc(userId)
      .collection("categories")
      .doc(docSnap.id);

    batch.set(userCatRef, categoryData);
  });

  await batch.commit();
};


export default addTransactionToCloud;