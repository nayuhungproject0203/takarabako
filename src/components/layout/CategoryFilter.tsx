import React from 'react';
import { Category } from '../../types';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: Category | 'All';
  onSelectCategory: (category: Category | 'All') => void;
}

export function CategoryFilter({ categories, activeCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
      <button
        onClick={() => onSelectCategory('All')}
        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          activeCategory === 'All'
            ? 'bg-primary text-white shadow-sm'
            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
        }`}
      >
        All Resources
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
