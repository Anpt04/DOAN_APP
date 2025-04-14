import { getDB } from './localDB';

export interface Transaction {
  id?: number;
  type: string;
  category: string;
  categoryName: string; // Thêm trường categoryName
  amount: number;
  date: string;
  note?: string;
}

// Hàm thêm giao dịch vào SQLite
export const addTransactionToLocal = async (transaction: Transaction): Promise<void> => {
  try {
    const db = getDB();
    if (!db) throw new Error('Database not initialized');

    await db.runAsync(
      `INSERT INTO transactions (type, category, amount, date, note) VALUES (?, ?, ?, ?, ?)`,
      [
        transaction.type,
        transaction.category,
        transaction.amount,
        transaction.date,
        transaction.note || '',
      ]
    );

    console.log('Transaction added successfully');
  } catch (error) {
    console.error('Error inserting transaction:', error);
  }
};

// Hàm lấy tất cả giao dịch từ SQLite
export const getAllTransactionsFromLocal = async (): Promise<Transaction[]> => {
  try {
    const db = getDB();
    if (!db) throw new Error('Database not initialized');

    const results = await db.getAllAsync<Transaction>(`SELECT * FROM transactions`);
    return results;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export default addTransactionToLocal;
