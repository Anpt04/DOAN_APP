import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAllCategoriesFromCloud } from "../DB/firebase/firebaseService";
import { getAllCategoriesFromLocal } from "../DB/LocalDB/localService";

export type Category = {
  id: string;
  name: string;
  type: "expense" | "income";
};

type CategoryContextType = {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
};

const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  setCategories: () => {},
});

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const auth = getAuth();

    // Lắng nghe khi người dùng đăng nhập hoặc đăng xuất
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("👤 Logged in, loading categories from Firestore");
        const cloudCategories = await getAllCategoriesFromCloud();
        setCategories(cloudCategories);
      } else {
        console.log("🙅 Not logged in, loading categories from SQLite");
        const localCategories = await getAllCategoriesFromLocal();
        setCategories(localCategories);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => useContext(CategoryContext);
