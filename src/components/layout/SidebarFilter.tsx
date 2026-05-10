import { ResourceType } from '../../types';

interface SidebarFilterProps {
  types: ResourceType[];
  tags: string[];
  activeType: ResourceType | 'All' | 'Home';
  activeTag: string;
  onSelectType: (type: ResourceType | 'All' | 'Home') => void;
  onSelectTag: (tag: string) => void;
}

export function SidebarFilter({ 
  types, 
  tags, 
  activeType, 
  activeTag, 
  onSelectType, 
  onSelectTag 
}: SidebarFilterProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Resource Type</h3>
        
        <button
          onClick={() => {
            onSelectType('Home');
            onSelectTag('All');
          }}
          className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeType === 'Home'
              ? 'bg-primary/10 text-primary'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          Home Overview
        </button>

        <button
          onClick={() => {
            onSelectType('All');
            onSelectTag('All');
          }}
          className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeType === 'All'
              ? 'bg-primary/10 text-primary'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          All Items
        </button>

        {types.map((type) => {
          const isActiveType = activeType === type;
          const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
          
          return (
            <button
              key={type}
              onClick={() => {
                onSelectType(type);
                onSelectTag('All');
              }}
              className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActiveType
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {typeLabel}
            </button>
          );
        })}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-col gap-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Related Tags</h3>
          
          <div className="flex flex-col gap-1 border-l-2 border-gray-100 pl-2 ml-4">
            <button
              onClick={() => onSelectTag('All')}
              className={`text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                activeTag === 'All'
                  ? 'text-primary font-medium bg-primary/5'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              All Tags
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onSelectTag(tag)}
                className={`text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                  activeTag === tag
                    ? 'text-primary font-medium bg-primary/5'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
