'use client';

import { useEffect, useState, useCallback } from 'react';

type ViewMode = 'grid' | 'list' | 'table';

interface Item {
  _id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  createdAt: string;
}

interface User {
  userId: string;
  email: string;
  role: 'admin' | 'viewer';
}

// --- SVG Icons (inline to avoid extra deps) ---
const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);
const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const TableIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 6h18M3 18h18M10 6v12M17 6v12" />
  </svg>
);
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]); // Store all items for category extraction
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [viewingItem, setViewingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    quantity: 0,
    price: 0,
  });

  useEffect(() => {
    fetchUser();
    fetchItems(); // This will also populate allItems on initial load
  }, []);

  // Extract unique categories from all items (not filtered)
  const categories = Array.from(new Set(allItems.map(item => item.category))).sort();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.category-dropdown')) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search – triggers 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems(searchQuery, categoryFilter);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, categoryFilter]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const fetchItems = async (search?: string, category?: string[]) => {
    try {
      const isSearch = search !== undefined || category !== undefined;
      if (isSearch) {
        setSearching(true);
      } else {
        setLoading(true);
      }
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category.length > 0) {
        category.forEach(cat => params.append('category', cat));
      }
      const queryString = params.toString();
      const res = await fetch(`/api/items${queryString ? `?${queryString}` : ''}`);
      const data = await res.json();
      setItems(data.items || []);
      // Update allItems when fetching without filters (initial load)
      if (!search && (!category || category.length === 0)) {
        setAllItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  // Fetch all items for category extraction (no filters) - used after mutations
  const fetchAllItems = async () => {
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      setAllItems(data.items || []);
    } catch (error) {
      console.error('Failed to fetch all items:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingItem ? '/api/items' : '/api/items';
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem
        ? { id: editingItem._id, ...formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error('Failed to save item');
      }

      setShowModal(false);
      setEditingItem(null);
      setFormData({ name: '', description: '', category: '', quantity: 0, price: 0 });
      fetchItems(searchQuery, categoryFilter);
      fetchAllItems(); // Refresh all items to update categories
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item');
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
    });
    setShowModal(true);
  };

  const handleViewItem = (item: Item) => {
    setViewingItem(item);
  };

  const handleEditFromView = () => {
    if (viewingItem) {
      handleEdit(viewingItem);
      setViewingItem(null);
    }
  };

  const handleDeleteFromView = async () => {
    if (viewingItem) {
      await handleDelete(viewingItem._id);
      setViewingItem(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/items?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete item');
      }

      fetchItems(searchQuery, categoryFilter);
      fetchAllItems(); // Refresh all items to update categories
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const confirmDelete = (item: Item) => {
    setDeletingItem(item);
  };

  const handleConfirmDelete = async () => {
    if (deletingItem) {
      await handleDelete(deletingItem._id);
      setDeletingItem(null);
    }
  };

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  // --- Render helpers for each view ---
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div 
          key={item._id} 
          onClick={() => handleViewItem(item)}
          className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition cursor-pointer"
        >
          <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
          <p className="text-gray-400 text-sm mb-4">{item.description}</p>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Category:</span>
              <span className="text-white">{item.category}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Quantity:</span>
              <span className="text-white">{item.quantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price:</span>
              <span className="text-white">${item.price.toFixed(2)}</span>
            </div>
          </div>
          {isAdmin && (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => handleEdit(item)} className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition">Edit</button>
              <button onClick={() => confirmDelete(item)} className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition">Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-3">
      {items.map((item) => (
        <div 
          key={item._id} 
          onClick={() => handleViewItem(item)}
          className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer"
        >
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">{item.name}</h3>
            <p className="text-gray-400 text-sm truncate">{item.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm shrink-0">
            <span className="bg-blue-900/40 text-blue-300 px-2 py-1 rounded">{item.category}</span>
            <span className="text-gray-300">Qty: <span className="text-white font-medium">{item.quantity}</span></span>
            <span className="text-green-400 font-semibold">${item.price.toFixed(2)}</span>
          </div>
          {isAdmin && (
            <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => handleEdit(item)} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition">Edit</button>
              <button onClick={() => confirmDelete(item)} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition">Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3 text-right">Quantity</th>
            <th className="px-4 py-3 text-right">Price</th>
            {isAdmin && <th className="px-4 py-3 text-center">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {items.map((item) => (
            <tr 
              key={item._id} 
              onClick={() => handleViewItem(item)}
              className="bg-gray-800/50 hover:bg-gray-700/50 transition cursor-pointer"
            >
              <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{item.name}</td>
              <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{item.description}</td>
              <td className="px-4 py-3"><span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded text-xs">{item.category}</span></td>
              <td className="px-4 py-3 text-right text-white">{item.quantity}</td>
              <td className="px-4 py-3 text-right text-green-400 font-semibold">${item.price.toFixed(2)}</td>
              {isAdmin && (
                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(item)} className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition">Edit</button>
                    <button onClick={() => confirmDelete(item)} className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition">Delete</button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-8">
      {/* Toolbar: Title + Search + View Toggle + Add */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 mb-6">


        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, description, or category..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
            >
              &times;
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative shrink-0 category-dropdown">
          <button
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            className="flex items-center justify-between w-48 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <span className="truncate">
              {categoryFilter.length === 0
                ? 'All Categories'
                : categoryFilter.length === 1
                ? categoryFilter[0]
                : `${categoryFilter.length} categories`}
            </span>
            <div className="flex items-center gap-1">
              {categoryFilter.length > 0 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setCategoryFilter([]);
                  }}
                  className="text-gray-400 hover:text-white px-1"
                >
                  &times;
                </span>
              )}
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {isCategoryDropdownOpen && (
            <div 
              className="absolute z-10 mt-1 w-48 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center px-4 py-2 hover:bg-gray-600 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={categoryFilter.includes(cat)}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (e.target.checked) {
                        setCategoryFilter([...categoryFilter, cat]);
                      } else {
                        setCategoryFilter(categoryFilter.filter(c => c !== cat));
                      }
                    }}
                    className="mr-2 h-4 w-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500 bg-gray-600"
                  />
                  <span className="text-white truncate">{cat}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-700 rounded-md p-0.5 shrink-0">
          {([['grid', GridIcon], ['list', ListIcon], ['table', TableIcon]] as [ViewMode, React.FC][]).map(
            ([mode, Icon]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
                className={`px-2.5 py-1.5 rounded transition ${
                  viewMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon />
              </button>
            )
          )}
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({ name: '', description: '', category: '', quantity: 0, price: 0 });
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition shrink-0"
          >
            + Add Item
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="mb-4 bg-yellow-900/30 border border-yellow-500 text-yellow-200 px-4 py-3 rounded-md text-center">
          You are logged in as a viewer. You can only view data.
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-gray-400">
            {searchQuery
              ? `No items matching "${searchQuery}".`
              : `No items found. ${isAdmin ? 'Click "+ Add Item" to create one.' : ''}`}
          </p>
        </div>
      ) : (
        <>
          <p className="text-gray-400 text-sm mb-4 text-center">
            {searching && <span className="inline-block mr-2 animate-pulse">Searching...</span>}
            {items.length} item{items.length !== 1 ? 's' : ''}
            {(searchQuery || categoryFilter.length > 0) && (
              <span>
                {' '}matching
                {searchQuery && ` "${searchQuery}"`}
                {categoryFilter.length > 0 && (
                  <span>
                    {searchQuery && ' in'}
                    {categoryFilter.length === 1
                      ? ` "${categoryFilter[0]}"`
                      : ` [${categoryFilter.join(', ')}]`}
                  </span>
                )}
              </span>
            )}
          </p>
          {viewMode === 'grid' && renderGridView()}
          {viewMode === 'list' && renderListView()}
          {viewMode === 'table' && renderTableView()}
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingItem ? 'Edit Item' : 'Add Item'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  required
                  min="0"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                  min="0"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-900/50 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Item</h3>
            <p className="text-gray-400 text-center mb-6">
              Are you sure you want to delete <span className="text-white font-medium">"{deletingItem.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingItem(null)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Item Modal */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{viewingItem.name}</h3>
              <button
                onClick={() => setViewingItem(null)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-400">Description</span>
                <p className="text-white mt-1">{viewingItem.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-400">Category</span>
                  <p className="mt-1">
                    <span className="bg-blue-900/40 text-blue-300 px-2 py-1 rounded text-sm">
                      {viewingItem.category}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-400">Quantity</span>
                  <p className="text-white mt-1">{viewingItem.quantity}</p>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-400">Price</span>
                <p className="text-green-400 font-semibold text-lg mt-1">
                  ${viewingItem.price.toFixed(2)}
                </p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-400">Created At</span>
                <p className="text-white mt-1">
                  {new Date(viewingItem.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              {isAdmin ? (
                <>
                  <button
                    onClick={handleEditFromView}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (viewingItem) {
                        setDeletingItem(viewingItem);
                        setViewingItem(null);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setViewingItem(null)}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition"
                  >
                    Close
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setViewingItem(null)}
                  className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
