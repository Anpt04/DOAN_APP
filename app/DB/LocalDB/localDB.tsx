import * as SQLite from 'expo-sqlite';

// Biến lưu trữ kết nối database
let db: SQLite.SQLiteDatabase | null = null;

// Hàm mở và khởi tạo database
export const initDatabase = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabaseAsync('appThuChi.db');
    console.log('✅ Database opened');

    await createTransactionsTable(); // Gọi tạo bảng luôn sau khi mở
    await createCategoriesTable(); // Tạo bảng categories
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

// Hàm trả về thể hiện database đã mở
export const getDB = (): SQLite.SQLiteDatabase | null => db;

// Tạo bảng nếu chưa có
const createTransactionsTable = async (): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized.');
  }

  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        category TEXT,
        categoryName TEXT,
        amount REAL,
        date TEXT,
        note TEXT
      );
    `);
    console.log('✅ Transactions table created');
  } catch (error) {
    console.error('❌ Error creating transactions table:', error);
    throw error;
  }
};

const createCategoriesTable = async (): Promise<void> => {
  if (!db) throw new Error('Database not initialized.');

  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        categoryId TEXT PRIMARY KEY,
        categoryName TEXT NOT NULL,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL
      );
    `);
    console.log('✅ Categories table created');

    // ➕ Thêm dữ liệu mặc định nếu chưa có
    const defaultCategories = [
      { categoryId: 'salary', categoryName: 'Lương', type: 'income' },
      { categoryId: 'gift', categoryName: 'Quà tặng', type: 'income' },
      { categoryId: 'food', categoryName: 'Ăn uống', type: 'expense' },
      { categoryId: 'entertainment', categoryName: 'Giải trí', type: 'expense' },
      { categoryId: 'transport', categoryName: 'Đi lại', type: 'expense' },
    ];

    for (const category of defaultCategories) {
      await db.runAsync(
        `INSERT OR IGNORE INTO categories (categoryId, categoryName, type) VALUES (?, ?, ?)`,
        [category.categoryId, category.categoryName, category.type]
      );
    }

    console.log('✅ Default categories inserted');
  } catch (error) {
    console.error('❌ Error creating categories table or inserting defaults:', error);
    throw error;
  }
};

