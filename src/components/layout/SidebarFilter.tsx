import React from 'react';

interface SidebarFilterProps {
  types: string[];
  topics: string[];
  activeType: string;
  activeTopic: string;
  onSelectType: (type: string) => void;
  onSelectTopic: (topic: string) => void;
}

export function SidebarFilter({ 
  types, 
  topics, 
  activeType, 
  activeTopic, 
  onSelectType, 
  onSelectTopic 
}: SidebarFilterProps) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Resource Type</h3>
      
      <button
        onClick={() => {
          onSelectType('All');
          onSelectTopic('All');
        }}
        className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          activeType === 'All'
            ? 'bg-primary/10 text-primary'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        All Resources
      </button>

      {types.map((type) => {
        const isActiveType = activeType === type;
        const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
        
        return (
          <div key={type} className="flex flex-col">
            <button
              onClick={() => {
                onSelectType(type);
                onSelectTopic('All');
              }}
              className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActiveType
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {typeLabel}
            </button>
            
            {/* Nested Topics */}
            {isActiveType && (
              <div className="ml-4 mt-1 mb-2 flex flex-col gap-1 border-l-2 border-gray-100 pl-2">
                <button
                  onClick={() => onSelectTopic('All')}
                  className={`text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                    activeTopic === 'All'
                      ? 'text-primary font-medium bg-primary/5'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  All {typeLabel}
                </button>
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => onSelectTopic(topic)}
                    className={`text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                      activeTopic === topic
                        ? 'text-primary font-medium bg-primary/5'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {topic.charAt(0).toUpperCase() + topic.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
