import React from 'react';
import { Resource } from '../../types';
import { ExternalLink, Edit2, Trash2, Box, FileText, Rss, BookOpen, Video, Globe, Mail } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
  onTagClick: (tag: string) => void;
  onCategoryClick: (category: string) => void;
}

const TypeIcon = ({ type, className = "" }: { type: Resource['type']; className?: string }) => {
  switch (type) {
    case 'tool': return <Box className={className} size={16} />;
    case 'article': return <FileText className={className} size={16} />;
    case 'blog': return <Rss className={className} size={16} />;
    case 'course': return <BookOpen className={className} size={16} />;
    case 'video': return <Video className={className} size={16} />;
    case 'website': return <Globe className={className} size={16} />;
    case 'newsletter': return <Mail className={className} size={16} />;
    default: return <ExternalLink className={className} size={16} />;
  }
};

export function ResourceCard({ resource, onEdit, onDelete, onTagClick, onCategoryClick }: ResourceCardProps) {
  const formattedDate = new Date(resource.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-background-card rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-3 gap-4">
        <div>
          <button 
            onClick={() => onCategoryClick(resource.category)}
            className="text-xs font-medium text-primary hover:text-primary-dark transition-colors mb-1.5 uppercase tracking-wider bg-primary-light px-2 py-0.5 rounded-full inline-block"
          >
            {resource.category}
          </button>
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-2 group-hover:underline decoration-primary decoration-2 underline-offset-4"
            >
              {resource.title}
              <ExternalLink size={14} className="text-gray-400 group-hover:text-primary transition-colors" />
            </a>
          </h3>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(resource)}
            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-light rounded-md transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDelete(resource.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 bg-gray-50 self-start px-2 py-1 rounded-md">
        <TypeIcon type={resource.type} />
        <span className="capitalize">{resource.type}</span>
      </div>

      {resource.note && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 italic">
          "{resource.note}"
        </p>
      )}

      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {resource.tags.map(tag => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className="text-xs text-gray-500 hover:text-primary hover:bg-primary-light bg-gray-100 px-2 py-1 rounded-md transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {formattedDate}
        </span>
      </div>
    </div>
  );
}
