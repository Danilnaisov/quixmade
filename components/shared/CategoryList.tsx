import React from "react";

interface Category {
  _id: string;
  name: string;
  name_ru: string;
}

interface CategoryListProps {
  categories: Category[];
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <div
          key={category._id}
          className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-bold">{category.name_ru}</h3>
          <p className="text-sm text-gray-600">{category.name}</p>
        </div>
      ))}
    </div>
  );
};
