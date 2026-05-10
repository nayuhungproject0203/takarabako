import React, { useState, useEffect, useRef } from 'react';
import { Resource, ResourceType } from '../../types';
import { Input, Select, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { TagInput } from './TagInput';
import { detectItemType, fetchYouTubeMetadata } from '../../utils/urlParser';
import { Loader2 } from 'lucide-react';

interface ResourceFormProps {
  initialData?: Resource;
  onSubmit: (data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const RESOURCE_TYPES: ResourceType[] = [
  'tool', 'essay', 'newsletter', 'video', 'course', 'website', 'book', 'quote'
];

export function ResourceForm({ initialData, onSubmit, onCancel }: ResourceFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    url: initialData?.url || '',
    type: initialData?.type || 'website' as ResourceType,
    tags: initialData?.tags || [],
    note: initialData?.note || '',
    quote: initialData?.quote || '',
    author: initialData?.author || '',
    source: initialData?.source || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const lastFetchedUrl = useRef(initialData?.url || '');

  useEffect(() => {
    const url = formData.url.trim();
    if (!url || url === lastFetchedUrl.current) return;

    const timeoutId = setTimeout(async () => {
      try {
        new URL(url);
      } catch {
        return; // Invalid URL, ignore
      }

      lastFetchedUrl.current = url;
      
      const detectedType = detectItemType(url);
      if (detectedType && detectedType !== formData.type) {
        setFormData(p => ({ ...p, type: detectedType }));
      }

      if (url.includes('books.com.tw')) {
        setFormData(p => ({
          ...p,
          source: p.source || '博客來'
        }));
      }

      if (detectedType === 'video' && (url.includes('youtube.com') || url.includes('youtu.be'))) {
        setIsFetchingMetadata(true);
        const metadata = await fetchYouTubeMetadata(url);
        setIsFetchingMetadata(false);
        
        if (metadata) {
          setFormData(p => ({
            ...p,
            title: p.title || metadata.title,
            author: p.author || metadata.author_name
          }));
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.url, formData.type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (formData.type === 'quote') {
      if (!formData.quote?.trim()) newErrors.quote = 'Quote text is required';
    } else if (formData.type === 'book') {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (formData.url.trim()) {
        try {
          new URL(formData.url);
        } catch {
          newErrors.url = 'Please enter a valid URL';
        }
      }
    } else {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.url.trim()) {
        newErrors.url = 'URL is required';
      } else {
        try {
          new URL(formData.url); // Simple URL validation
        } catch {
          newErrors.url = 'Please enter a valid URL';
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="mb-4">
        <Select
          label="Type"
          value={formData.type}
          onChange={(e) => setFormData(p => ({ ...p, type: e.target.value as ResourceType }))}
        >
          {RESOURCE_TYPES.map(t => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </Select>
      </div>

      {formData.type === 'quote' ? (
        <>
          <Textarea
            label="Quote Text"
            value={formData.quote}
            onChange={(e) => setFormData(p => ({ ...p, quote: e.target.value }))}
            error={errors.quote}
            placeholder="Enter the quote..."
            rows={3}
            autoFocus
          />
          <Input
            label="Author (Optional)"
            value={formData.author}
            onChange={(e) => setFormData(p => ({ ...p, author: e.target.value }))}
            placeholder="Who said this?"
          />
          <Input
            label="Source (Optional)"
            value={formData.source}
            onChange={(e) => setFormData(p => ({ ...p, source: e.target.value }))}
            placeholder="Where is it from? (Book, URL, etc.)"
          />
        </>
      ) : formData.type === 'book' ? (
        <>
          <Input
            label="Book Title"
            value={formData.title}
            onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
            error={errors.title}
            placeholder="e.g., Atomic Habits"
            autoFocus
          />
          <Input
            label="Author (Optional)"
            value={formData.author}
            onChange={(e) => setFormData(p => ({ ...p, author: e.target.value }))}
            error={errors.author}
            placeholder="e.g., James Clear"
          />
          <Input
            label="Source / Publisher (Optional)"
            value={formData.source}
            onChange={(e) => setFormData(p => ({ ...p, source: e.target.value }))}
            placeholder="e.g., 博客來, Amazon"
          />
          <Input
            label="Source URL (Optional)"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData(p => ({ ...p, url: e.target.value }))}
            error={errors.url}
            placeholder="https://..."
          />
        </>
      ) : (
        <>
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
            error={errors.title}
            placeholder="e.g., React Official Documentation"
            autoFocus
          />

          <Input
            label={
              <div className="flex items-center gap-2">
                URL
                {isFetchingMetadata && (
                  <span className="flex items-center gap-1 text-xs text-primary font-normal">
                    <Loader2 size={12} className="animate-spin" /> Fetching details...
                  </span>
                )}
              </div>
            }
            type="url"
            value={formData.url}
            onChange={(e) => setFormData(p => ({ ...p, url: e.target.value }))}
            error={errors.url}
            placeholder="https://..."
          />

          {formData.type === 'video' && (
            <Input
              label="Creator / Channel (Optional)"
              value={formData.author}
              onChange={(e) => setFormData(p => ({ ...p, author: e.target.value }))}
              placeholder="e.g., YouTube Channel Name"
            />
          )}

          {(formData.type === 'essay' || formData.type === 'website') && (
            <>
              <Input
                label="Author (Optional)"
                value={formData.author}
                onChange={(e) => setFormData(p => ({ ...p, author: e.target.value }))}
                placeholder="e.g., Paul Graham"
              />
              <Input
                label="Source / Site Name (Optional)"
                value={formData.source}
                onChange={(e) => setFormData(p => ({ ...p, source: e.target.value }))}
                placeholder="e.g., Medium, Personal Blog"
              />
            </>
          )}
        </>
      )}

      <TagInput
        label="Tags"
        tags={formData.tags}
        onChange={(tags) => setFormData(p => ({ ...p, tags }))}
      />

      <Textarea
        label="Notes (Optional)"
        value={formData.note}
        onChange={(e) => setFormData(p => ({ ...p, note: e.target.value }))}
        placeholder="Why is this useful? Any key takeaways?"
        rows={3}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Save Changes' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
}
