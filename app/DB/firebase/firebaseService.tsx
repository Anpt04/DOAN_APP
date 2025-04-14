import { db, auth } from "./firebaseConfig";
import { DocumentReference, collection, addDoc, getDocs } from "firebase/firestore";

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