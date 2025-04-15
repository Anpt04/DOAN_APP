import { auth } from "./firebase/firebaseConfig";
import { addTransactionToLocal } from "./LocalDB/localService";
import { addTransactionToCloud } from "./firebase/firebaseService";

export interface Transaction {
  id?: string;
  type: string;
  category: string;
  categoryName: string; // Thêm trường categoryName
  amount: number;
  date: string;
  note?: string;
}
// Hàm thêm giao dịch (có thể lưu vào cloud hoặc local)
export const addTransaction = async (transaction: Transaction) => {
  if (auth.currentUser) {
    await addTransactionToCloud(transaction);
  } else {
    await addTransactionToLocal(transaction);
  }
};

export default addTransaction;

