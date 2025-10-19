"use client";

import React, { useState } from "react";

interface Category {
  title: string;
  color: string;
}

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState("All categories");

  const categories: Category[] = [
    { title: "All categories", color: "bg-gray-500" },
    { title: "Nature", color: "bg-green-500" },
    { title: "Urban", color: "bg-blue-500" },
    { title: "Noise", color: "bg-red-500" },
    { title: "Seasonal", color: "bg-orange-500" },
    { title: "Meditation", color: "bg-purple-500" },
    { title: "Ambient", color: "bg-teal-500" },
  ];

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6">
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
        {categories.map((category) => (
          <button
            key={category.title}
            onClick={() => setSelectedCategory(category.title)}
            className={`
              px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 
              hover:scale-105 border border-transparent
              ${
                selectedCategory === category.title
                  ? `${category.color} text-white shadow-lg scale-105`
                  : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border-white/10"
              }
            `}
          >
            {category.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
