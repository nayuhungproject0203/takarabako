import { Resource, ResourceType } from '../../types';
import { ExternalLink, Edit2, Trash2, Box, FileText, BookOpen, Youtube, Globe, Mail, Quote, Copy, Book, Headphones } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
  onTagClick: (tag: string) => void;
  onTypeClick: (type: ResourceType | 'All' | 'Home') => void;
}

const TypeIcon = ({ type, className = "" }: { type: Resource['type']; className?: string }) => {
  switch (type) {
    case 'tool': return <Box className={className} size={16} />;
    case 'essay': return <FileText className={className} size={16} />;
    case 'course': return <BookOpen className={className} size={16} />;
    case 'youtube': return <Youtube className={className} size={16} />;
    case 'podcast': return <Headphones className={className} size={16} />;
    case 'website': return <Globe className={className} size={16} />;
    case 'newsletter': return <Mail className={className} size={16} />;
    case 'quote': return <Quote className={className} size={16} />;
    case 'book': return <Book className={className} size={16} />;
    default: return <ExternalLink className={className} size={16} />;
  }
};

export function ResourceCard({ resource, onEdit, onDelete, onTagClick, onTypeClick }: ResourceCardProps) {
  const formattedDate = new Date(resource.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  if (resource.type === 'quote') {
    return (
      <div className="bg-[#FCFBF9] rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow p-6 sm:p-7 flex flex-col h-full group sm:col-span-2 lg:col-span-2 relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium uppercase tracking-wider">
            <Quote size={12} className="fill-current" />
            <span>Quote</span>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => navigator.clipboard.writeText(resource.quote || '')}
              className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Copy"
            >
              <Copy size={16} />
            </button>
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

        <div className="flex-1 flex flex-col justify-center border-l-[3px] border-amber-200/60 pl-5 ml-1 py-1 mb-6">
          <p className="text-[17px] sm:text-lg text-gray-800 leading-[1.8] max-w-prose line-clamp-5 whitespace-pre-wrap">
            {resource.quote}
          </p>
          
          {(resource.author || resource.source) && (
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
              {resource.author && <span className="font-medium text-gray-900">{resource.author}</span>}
              {resource.author && resource.source && <span className="text-gray-300">•</span>}
              {resource.source && (
                resource.source.startsWith('http') ? (
                  <a 
                    href={resource.source} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 hover:underline transition-colors"
                  >
                    Source <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-gray-500">{resource.source}</span>
                )
              )}
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 flex items-end justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {resource.tags.map(tag => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="text-[11px] text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors px-2.5 py-1 rounded-full border border-gray-100 bg-white/50 shadow-sm"
              >
                #{tag}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-gray-300 whitespace-nowrap">
            {formattedDate}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-card rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-3 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {resource.url ? (
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-2 group-hover:underline decoration-primary decoration-2 underline-offset-4"
              >
                {resource.title}
                <ExternalLink size={14} className="text-gray-400 group-hover:text-primary transition-colors" />
              </a>
            ) : (
              <span className="flex items-center gap-2">
                {resource.title}
              </span>
            )}
          </h3>
          {resource.type === 'book' && resource.author && (
            <p className="text-sm text-gray-500 mt-1.5 font-medium">by {resource.author}</p>
          )}
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

      <button 
        onClick={() => onTypeClick(resource.type)}
        className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 bg-gray-50 hover:bg-gray-100 transition-colors self-start px-2 py-1 rounded-md"
      >
        <TypeIcon type={resource.type} />
        <span className="capitalize">{resource.type}{resource.kind ? ` • ${resource.kind}` : ''}</span>
      </button>

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
