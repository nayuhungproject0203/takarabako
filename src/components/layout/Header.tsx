import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
  onLogoClick?: () => void;
}

export function Header({ searchQuery, onSearchChange, onAddClick, onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-gray-200/50 py-4 px-6 md:px-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <button 
        onClick={onLogoClick}
        className="flex items-center gap-2 w-full sm:w-auto hover:opacity-80 transition-opacity focus:outline-none"
      >
        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xl shadow-sm">
          t
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">takarabako</h1>
      </button>

      <div className="flex-1 w-full sm:max-w-md relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search links, tags, or notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
          />
        </div>
      </div>

      <div className="w-full sm:w-auto flex justify-end">
        <Button onClick={onAddClick} className="w-full sm:w-auto gap-2 rounded-full shadow-sm">
          <Plus size={18} />
          Add Resource
        </Button>
      </div>
    </header>
  );
}
