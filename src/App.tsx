import React, { useState, useMemo } from 'react';
import { Resource, ResourceType } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/layout/Header';
import { SidebarFilter } from './components/layout/SidebarFilter';
import { ResourceCard } from './components/resource/ResourceCard';
import { ResourceForm } from './components/resource/ResourceForm';
import { Modal } from './components/ui/Modal';
import { X, Box, FileText, Rss, BookOpen, Video, Globe, Mail, Quote as QuoteIcon, Book as BookIcon } from 'lucide-react';

const RESOURCE_TYPES: ResourceType[] = [
  'tool', 'article', 'blog', 'newsletter', 'course', 'video', 'website', 'quote', 'book'
];

const COLLECTIONS: { type: ResourceType; title: string; description: string; icon: React.ElementType }[] = [
  { type: 'tool', title: 'Tools', description: 'Apps, software, and utilities.', icon: Box },
  { type: 'article', title: 'Articles', description: 'In-depth reads and tutorials.', icon: FileText },
  { type: 'blog', title: 'Blogs', description: 'Personal sites and ongoing series.', icon: Rss },
  { type: 'newsletter', title: 'Newsletters', description: 'Subscribed feeds and emails.', icon: Mail },
  { type: 'course', title: 'Courses', description: 'Structured learning materials.', icon: BookOpen },
  { type: 'video', title: 'Videos', description: 'Talks, tutorials, and guides.', icon: Video },
  { type: 'website', title: 'Websites', description: 'General pages and references.', icon: Globe },
  { type: 'quote', title: 'Quotes', description: 'Saved passages and thoughts.', icon: QuoteIcon },
  { type: 'book', title: 'Bookshelf', description: 'Reading list and references.', icon: BookIcon },
];

function App() {
  const [resources, setResources] = useLocalStorage<Resource[]>('knowbase_resources', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('All');
  const [activeType, setActiveType] = useState<ResourceType | 'All' | 'Home'>('Home');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | undefined>(undefined);

  const relatedTags = useMemo(() => {
    const relevantResources = activeType === 'All' 
      ? resources 
      : resources.filter(r => r.type === activeType);
    
    const tagsSet = new Set<string>();
    relevantResources.forEach(r => {
      r.tags.forEach(t => tagsSet.add(t));
    });
    return Array.from(tagsSet).sort();
  }, [resources, activeType]);

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch = searchQuery === '' || 
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.quote?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.source?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTag = activeTag === 'All' || res.tags.includes(activeTag);
      const matchesType = (activeType === 'All' || activeType === 'Home') || res.type === activeType;
      
      const matchesTags = activeTags.length === 0 || 
        activeTags.every(t => res.tags.includes(t));

      return matchesSearch && matchesTag && matchesType && matchesTags;
    }).sort((a, b) => b.createdAt - a.createdAt);
  }, [resources, searchQuery, activeTag, activeType, activeTags]);

  const handleAddOrEdit = (data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingResource) {
      setResources(prev => prev.map(r => 
        r.id === editingResource.id 
          ? { ...r, ...data, updatedAt: Date.now() } 
          : r
      ));
    } else {
      const newResource: Resource = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setResources(prev => [newResource, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      setResources(prev => prev.filter(r => r.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingResource(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (resource: Resource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingResource(undefined);
  };

  const toggleTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleReset = () => {
    setSearchQuery('');
    setActiveTag('All');
    setActiveType('Home');
    setActiveTags([]);
  };

  return (
    <div className="min-h-screen bg-background relative font-sans">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={openAddModal}
        onLogoClick={handleReset}
      />

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8 flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-56 shrink-0 sticky top-24">
          <div className="space-y-8">
            <SidebarFilter 
              types={RESOURCE_TYPES}
              tags={relatedTags}
              activeType={activeType}
              activeTag={activeTag}
              onSelectType={setActiveType}
              onSelectTag={setActiveTag}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {activeTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap animate-in fade-in slide-in-from-top-2 duration-300 mb-6">
              <span className="text-sm text-gray-500 font-medium">Active Filters:</span>
              {activeTags.map(tag => (
                <span 
                  key={tag}
                  className="inline-flex items-center gap-1 bg-primary text-white px-2.5 py-1 rounded-md text-sm font-medium shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  #{tag}
                  <button 
                    onClick={() => toggleTag(tag)}
                    className="hover:text-primary-light p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              <button 
                onClick={() => setActiveTags([])}
                className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2 ml-2 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

        {activeType === 'Home' && searchQuery === '' && activeTags.length === 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Collections</h2>
              <p className="text-gray-500">Browse your knowledge base by category.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {COLLECTIONS.map((collection) => {
                const Icon = collection.icon;
                const count = resources.filter(r => r.type === collection.type).length;
                return (
                  <button
                    key={collection.type}
                    onClick={() => setActiveType(collection.type)}
                    className="group relative bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-2xl p-6 text-left flex flex-col items-start overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <div className="absolute right-0 top-0 p-6 text-gray-100 group-hover:text-primary/5 transition-colors duration-500 group-hover:scale-110 transform origin-top-right">
                      <Icon size={80} />
                    </div>
                    
                    <div className="relative z-10 w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon size={20} />
                    </div>
                    
                    <h3 className="relative z-10 text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                      {collection.title}
                    </h3>
                    
                    <p className="relative z-10 text-sm text-gray-500 mb-6 line-clamp-2 pr-4">
                      {collection.description}
                    </p>
                    
                    <div className="relative z-10 mt-auto flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md group-hover:bg-primary/5 group-hover:text-primary/70 transition-colors">
                      <span>{count}</span>
                      <span>{count === 1 ? 'item' : 'items'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max items-start">
            {filteredResources.map(resource => (
              <ResourceCard 
                key={resource.id}
                resource={resource}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onTagClick={toggleTag}
                onTypeClick={setActiveType}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 border-dashed max-w-2xl mx-auto">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-500 mb-8">
              {resources.length === 0 
                ? "You haven't added any resources to your knowledge base yet." 
                : "Try adjusting your search or category filters."}
            </p>
            {resources.length === 0 && (
              <button 
                onClick={openAddModal}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm inline-flex items-center gap-2"
              >
                Add Your First Resource
              </button>
            )}
          </div>
        )}
        </div>
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={editingResource ? "Edit Resource" : "Add New Resource"}
      >
        <ResourceForm 
          initialData={editingResource}
          onSubmit={handleAddOrEdit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}

export default App;
