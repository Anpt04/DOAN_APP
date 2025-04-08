import { auth } from "./firebase/firebaseConfig";
import { Transaction } from "./LocalDB/localService";
import { addTransactionToLocal } from "./LocalDB/localService";
import { addTransactionToCloud } from "./firebase/firebaseService";

// Hàm thêm giao dịch (có thể lưu vào cloud hoặc local)
export const addTransaction = async (transaction: Transaction) => {
  if (auth.currentUser) {
    await addTransactionToCloud(transaction);
  } else {
    await addTransactionToLocal(transaction);
  }
};

export default addTransaction;

