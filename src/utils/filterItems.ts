import { Resource, ResourceType } from '../types';

interface FilterOptions {
  resources: Resource[];
  searchQuery: string;
  activeType: ResourceType | 'All' | 'Home';
  selectedTags: string[];
  selectedKind?: 'source' | 'work';
}

export function filterItems({
  resources,
  searchQuery,
  activeType,
  selectedTags,
  selectedKind
}: FilterOptions): Resource[] {
  return resources.filter(res => {
    const matchesSearch = searchQuery === '' || 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.note && res.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (res.quote && res.quote.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (res.author && res.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (res.source && res.source.toLowerCase().includes(searchQuery.toLowerCase())) ||
      res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = (activeType === 'All' || activeType === 'Home') || res.type === activeType;
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(t => res.tags.includes(t));

    const matchesKind = !selectedKind || res.kind === selectedKind;

    return matchesSearch && matchesType && matchesTags && matchesKind;
  }).sort((a, b) => b.createdAt - a.createdAt);
}
