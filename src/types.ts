export type ResourceType = 'tool' | 'article' | 'blog' | 'newsletter' | 'course' | 'video' | 'website';

export type Topic = 'Frontend' | 'AI' | 'Writing' | 'Psychology' | 'Research' | 'Productivity' | 'Design' | 'Career';

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  topic: Topic;
  tags: string[];
  note?: string;
  createdAt: number;
  updatedAt: number;
}
