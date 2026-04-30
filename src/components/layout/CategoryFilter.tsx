import React from 'react';

interface CategoryFilterProps {
  items: string[];
  activeItem: string;
  onSelectItem: (item: any) => void;
  allLabel?: string;
}

export function CategoryFilter({ items, activeItem, onSelectItem, allLabel = "All" }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
      <button
        onClick={() => onSelectItem('All')}
        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          activeItem === 'All'
            ? 'bg-primary text-white shadow-sm'
            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
        }`}
      >
        {allLabel}
      </button>
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelectItem(item)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeItem === item
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </button>
      ))}
    </div>
  );
}
