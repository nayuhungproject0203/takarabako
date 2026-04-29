import React, { useState } from 'react';
import { Resource, Category, ResourceType } from '../../types';
import { Input, Select, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { TagInput } from './TagInput';

interface ResourceFormProps {
  initialData?: Resource;
  onSubmit: (data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const CATEGORIES: Category[] = [
  'AI Tools', 'Frontend Learning', 'Writing', 'Psychology', 'Newsletters', 'Blogs', 'Other'
];

const RESOURCE_TYPES: ResourceType[] = [
  'tool', 'article', 'blog', 'newsletter', 'course', 'video', 'website'
];

export function ResourceForm({ initialData, onSubmit, onCancel }: ResourceFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    url: initialData?.url || '',
    type: initialData?.type || 'website' as ResourceType,
    category: initialData?.category || 'Other' as Category,
    tags: initialData?.tags || [],
    note: initialData?.note || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
        error={errors.title}
        placeholder="e.g., React Official Documentation"
        autoFocus
      />

      <Input
        label="URL"
        type="url"
        value={formData.url}
        onChange={(e) => setFormData(p => ({ ...p, url: e.target.value }))}
        error={errors.url}
        placeholder="https://..."
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData(p => ({ ...p, category: e.target.value as Category }))}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>

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
          {initialData ? 'Save Changes' : 'Add Resource'}
        </Button>
      </div>
    </form>
  );
}
