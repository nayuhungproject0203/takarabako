import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  error?: string;
}

export function TagInput({ tags, onChange, label, error }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim().toLowerCase();
      
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag if backspace is pressed and input is empty
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} <span className="text-gray-400 font-normal">(Press Enter to add)</span>
        </label>
      )}
      <div 
        className={`w-full min-h-[42px] px-2 py-1.5 border rounded-lg bg-white flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-colors
          ${error ? 'border-red-300 focus-within:ring-red-500' : 'border-gray-200'}
        `}
      >
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-light text-primary-dark text-sm font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-primary hover:text-primary-dark focus:outline-none"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "add a tag..." : ""}
          className="flex-1 min-w-[80px] bg-transparent outline-none text-sm text-gray-900"
        />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
