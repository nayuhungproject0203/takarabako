import React, { useState, useMemo } from 'react';
import { Resource, Category } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/layout/Header';
import { CategoryFilter } from './components/layout/CategoryFilter';
import { ResourceCard } from './components/resource/ResourceCard';
import { ResourceForm } from './components/resource/ResourceForm';
import { Modal } from './components/ui/Modal';
import { X } from 'lucide-react';

const CATEGORIES: Category[] = [
  'AI Tools', 'Frontend Learning', 'Writing', 'Psychology', 'Newsletters', 'Blogs', 'Other'
];

function App() {
  const [resources, setResources] = useLocalStorage<Resource[]>('knowbase_resources', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | undefined>(undefined);

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch = searchQuery === '' || 
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = activeCategory === 'All' || res.category === activeCategory;
      
      const matchesTags = activeTags.length === 0 || 
        activeTags.every(t => res.tags.includes(t));

      return matchesSearch && matchesCategory && matchesTags;
    }).sort((a, b) => b.createdAt - a.createdAt);
  }, [resources, searchQuery, activeCategory, activeTags]);

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

  return (
    <div className="min-h-screen bg-background relative font-sans">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={openAddModal}
      />

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="mb-8 space-y-6">
          <CategoryFilter 
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {activeTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap animate-in fade-in slide-in-from-top-2 duration-300">
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
        </div>

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max items-start">
            {filteredResources.map(resource => (
              <ResourceCard 
                key={resource.id}
                resource={resource}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onTagClick={toggleTag}
                onCategoryClick={setActiveCategory}
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
