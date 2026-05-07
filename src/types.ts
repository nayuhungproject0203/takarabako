export type ResourceType = 'tool' | 'article' | 'blog' | 'newsletter' | 'course' | 'video' | 'website' | 'quote' | 'book';

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  tags: string[];
  note?: string;
  quote?: string;
  author?: string;
  source?: string;
  createdAt: number;
  updatedAt: number;
}
