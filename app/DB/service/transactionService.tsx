import { auth } from "../firebase/firebaseConfig";
import * as LocalService from "../LocalDB/localService";
import * as CloudService from "../firebase/firebaseService";

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
    await CloudService.addTransactionToCloud(transaction);
  } else {
    await LocalService.addTransactionToLocal(transaction);
  }
};

export const getTransactions = async (): Promise<Transaction[]> => {
  if (auth.currentUser) {
    return await CloudService.getTransactionsFromCloud();
  } else {
    return await LocalService.getTransactionsFromLocal();
  }
};

export const getTransactionById = async (id: string): Promise<Transaction | null> => {
  if (auth.currentUser) {
    return await CloudService.getTransactionByIdFromCLoud(id);
  } else {
    return await LocalService.getTransactionByIdFromLocal(id);
  }
};

export const updateTransaction = async (id: string, updatedData: Partial<Transaction>) => {
  if (auth.currentUser) {
    await CloudService.updateTransactionToCloud(id, updatedData);
  } else {
    await LocalService.updateTransactionToLocal(id, updatedData);
  }
};

export const deleteTransaction = async (id: string) => {
  if (auth.currentUser) {
    await CloudService.deleteTransactionFromCloud(id);
  } else {
    await LocalService.deleteTransactionFromLocal(id);
  }
};

export const getTransactionsByCategory = async (categoryId: string): Promise<Transaction[]> => {
  if (auth.currentUser) {
    return await CloudService.getTransactionByCategoryIdFromCloud(categoryId);
  } else {
    return await LocalService.getTransactionByCategoryIdFromLocal(categoryId);
  }
}

export const setMonthlyLimits = async (month: string, amountLimit: number) => {
  if (auth.currentUser) {
    await CloudService.setMonthlyLimitToCloud(month, amountLimit);
  } else {
    await LocalService.setMonthlyLimitToLocal(month, amountLimit);
  }
};

export const getMonthlyLimits = async (month: string): Promise<number | null> => {
  if (auth.currentUser) {
    return await CloudService.getMonthlyLimitFromCloud(month);
  } else {
    return await LocalService.getMonthlyLimitFromLocal(month);
  }
};


export default {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionsByCategory,
};

