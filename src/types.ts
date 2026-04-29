export type ResourceType = 'tool' | 'article' | 'blog' | 'newsletter' | 'course' | 'video' | 'website';

export type Category = 'AI Tools' | 'Frontend Learning' | 'Writing' | 'Psychology' | 'Newsletters' | 'Blogs' | 'Other';

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  category: Category;
  tags: string[];
  note?: string;
  createdAt: number;
  updatedAt: number;
}
