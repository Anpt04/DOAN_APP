import React, { createContext, useContext, useState } from "react";

export type Category = {
  id: string;
  name: string;
  type: "expense" | "income";
};

type CategoryContextType = {
  categories: Category[];
  setCategories: (categories: Category[]) => void; // ✅ THÊM vào đây
};

const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  setCategories: () => {}, // ✅ THÊM vào đây
});

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => useContext(CategoryContext);
