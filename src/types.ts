export type ResourceType = 'tool' | 'essay' | 'newsletter' | 'course' | 'youtube' | 'website' | 'quote' | 'book' | 'podcast';

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  kind?: 'source' | 'work';
  tags: string[];
  note?: string;
  quote?: string;
  author?: string;
  source?: string;
  createdAt: number;
  updatedAt: number;
}
