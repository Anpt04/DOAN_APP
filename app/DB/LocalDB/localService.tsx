import { getDB } from './localDB'; 
import uuid from 'react-native-uuid';

export interface Transaction {
  id?: string;
  type: string;
  category: string;
  categoryName: string; 
  amount: number;
  date: string;
  note?: string;
}
import { Category } from '../../contexts/categoryContext';

// Hàm thêm giao dịch vào SQLite
export const addTransactionToLocal = async (transaction: Transaction): Promise<void> => {
  try {
    const db = getDB();
    if (!db) throw new Error('Database not initialized-1');

    await db.runAsync(
      `INSERT INTO transactions (type, category, categoryName, amount, date, note) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        transaction.type,
        transaction.category,
        transaction.categoryName,
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
export const getTransactionsFromLocal = async (): Promise<Transaction[]> => {
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

export const getTransactionByIdFromLocal = async (id: string): Promise<Transaction | null> => {
  try {
    const db = getDB();
    if (!db) throw new Error("Database not initialized");

    const result = await db.getFirstAsync<Transaction>(
      `SELECT * FROM transactions WHERE id = ?`,
      [id]
    );

    return result || null;
    console.log(result);
  } catch (error) {
    console.error("❌ Lỗi khi lấy giao dịch theo ID từ SQLite:", error);
    return null;
  }
};

export const getTransactionByCategoryIdFromLocal = async (id: string): Promise<Transaction[]> => {
  try {
    const db = getDB();
    if (!db) throw new Error("Database not initialized");

    const result = await db.getAllAsync<Transaction>(
      'SELECT * FROM transactions WHERE category = ?;',
      [id]
    );
    console.log("🗂️ Giao dịch theo categoryId từ SQLite:", result);
    return result || [];
  } catch (error) {
    console.error("❌ Lỗi khi lấy giao dịch theo categoryId từ SQLite:", error);
    return [];
  }
};


export const updateTransactionToLocal = async (id: string, newData: Partial<Transaction>) => {
  try {
    const db = getDB();
    if (!db) throw new Error("Database not initialized");

    const fields = [];
    const values: any[] = [];

    for (const key in newData) {
      if (newData[key as keyof Transaction] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(newData[key as keyof Transaction]);
      }
    }

    values.push(id);
    await db.runAsync(`UPDATE transactions SET ${fields.join(", ")} WHERE id = ?`, values);
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật giao dịch trong SQLite:", error);
    throw error;
  }
};

export const deleteTransactionFromLocal = async (id: string) => {
  try {
    const db = getDB();
    if (!db) throw new Error("Database not initialized");

    await db.runAsync(`DELETE FROM transactions WHERE id = ?`, [id]);
  } catch (error) {
    console.error("❌ Lỗi khi xóa giao dịch trong SQLite:", error);
    throw error;
  }
};


export const addCategoryToLocal = async (
  category: { name: string; type: string }
): Promise<Category> => {
  try {
    const db = getDB();
    if (!db) throw new Error("Database not initialized");

    const id = uuid.v4().toString(); // Tạo id tự sinh

    await db.runAsync(
      `INSERT INTO categories (categoryId, categoryName, type) VALUES (?, ?, ?)`,
      [id, category.name, category.type]
    );

    return {
      id,
      name: category.name,
      type: category.type as "income" | "expense",
    };
  } catch (error) {
    console.error("❌ Lỗi khi thêm danh mục vào SQLite:", error);
    throw error;
  }
};


export const updateCategoryToLocal = async (id: string, updatedData: { name?: string; type?: string }) => {
  try {
    const db = getDB();
    if (!db) throw new Error("Database not initialized");

    const updates = [];
    const values: any[] = [];

    if (updatedData.name) {
      updates.push("categoryName = ?");
      values.push(updatedData.name);
    }
    if (updatedData.type) {
      updates.push("type = ?");
      values.push(updatedData.type);
    }

    if (updates.length > 0) {
      values.push(id);
      await db.runAsync(`UPDATE categories SET ${updates.join(", ")} WHERE categoryId = ?`, values);
    }
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật danh mục trong SQLite:", error);
    throw error;
  }
};

export const deleteCategoryFromLocal = async (id: string) => {
  try {
    const db = getDB();
    if (!db) throw new Error("Database not initialized");

    await db.runAsync(`DELETE FROM categories WHERE categoryId = ?`, [id]);
  } catch (error) {
    console.error("❌ Lỗi khi xóa danh mục trong SQLite:", error);
    throw error;
  }
};

export const setMonthlyLimitToLocal = async (month: string, amountLimit: number): Promise<void> => {
  try {
    const db = getDB();
    if (!db) throw new Error("Database not initialized");
    await db.runAsync(
      `INSERT OR REPLACE INTO monthLimits (month, amountLimit) VALUES (?, ?)`,
      [month, amountLimit]
    );
  } catch (error) {
    console.error("❌ Lỗi khi thiết lập giới hạn hàng tháng trong SQLite:", error);
    throw error;
  }
};

export const getMonthlyLimitFromLocal = async (month: string): Promise<number | null> => {
  try {
    const db = getDB();
    if (!db) throw new Error("Database not initialized");

    const result = await db.getFirstAsync(
      `SELECT amountLimit FROM monthLimits WHERE month = ?`,
      [month]
    ) as { amountLimit: number } | undefined;

    return result?.amountLimit ?? null;
  } catch (error) {
    console.error("❌ Lỗi khi lấy hạn mức tháng từ SQLite:", error);
    throw error;
  }
};


export const getAllCategoriesFromLocal = async (): Promise<Category[]> => {
  try {
    const db = getDB();
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<{id: string; name: string; type: string}>(
      `SELECT categoryId   AS id,
              categoryName AS name,
              type
       FROM categories`
    );
    console.log("🗂️ Categories from SQLite:", rows);
    // Format lại nếu cần (vì SQLite trả về tất cả là string)
    const formattedRows = rows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type as 'expense' | 'income',
    }));
    // console.log("✅ format danh mục từ SQLite thành công", formattedRows);
    return formattedRows;
    
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh mục từ SQLite:", error);
    return [];
  }
};

export default addTransactionToLocal;
