import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

// Hàm khởi tạo và tạo bảng
export const initLocalDB = async () => {
  try {
    db = await SQLite.openDatabaseAsync('expenses.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        category TEXT,
        amount REAL,
        date TEXT,
        note TEXT
      );
    `);
    console.log('Table created successfully');
  } catch (error) {
    console.log('Error creating table:');
  }
};

// Xuất cơ sở dữ liệu để dùng nơi khác
export const getDB = (): SQLite.SQLiteDatabase | null => db;
export default getDB;
