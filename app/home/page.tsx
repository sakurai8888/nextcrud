'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

interface Item {
  _id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  createdAt: string;
}

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  // Select only 10 random items for the hero banner
  const featuredItems = items.length > 10 
    ? [...items].sort(() => 0.5 - Math.random()).slice(0, 10) 
    : items;

  // Auto-cycle through featured items every 4 seconds
  useEffect(() => {
    if (featuredItems.length === 0) return;
    
    const interval = setInterval(() => {
      handleChangeIndex((prev) => (prev + 1) % featuredItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [featuredItems]);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentItem = featuredItems[currentIndex];

  const handleChangeIndex = (newIndexOrFn: number | ((prev: number) => number)) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex(newIndexOrFn);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const goToPrevious = () => {
    handleChangeIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  const goToNext = () => {
    handleChangeIndex((prev) => (prev + 1) % featuredItems.length);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onLogout={handleLogout} />
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-gray-900 to-purple-900/30" />
        
        <div className="relative w-full max-w-[1280px] mx-auto px-6 py-16">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                VaultGrid
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Your modern inventory management solution. Track, manage, and organize your assets with ease.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/inventory"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
              >
                View Inventory
              </Link>
            </div>
          </div>

          {/* Featured Items Carousel */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-white text-center mb-8">
              Featured Items
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-400">Loading items...</div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400">No items available.</p>
              </div>
            ) : (
              <div className="relative max-w-3xl mx-auto">
                {/* Item Card with Fade Effect */}
                <div 
                  className={`bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700 transition-all duration-300 ${
                    isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    {/* Item Icon/Placeholder */}
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 text-center md:text-left">
                      <span className="inline-block px-3 py-1 bg-blue-900/40 text-blue-300 rounded-full text-sm mb-3">
                        {currentItem?.category}
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {currentItem?.name}
                      </h3>
                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {currentItem?.description}
                      </p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                        <span className="text-gray-300">
                          Qty: <span className="text-white font-medium">{currentItem?.quantity}</span>
                        </span>
                        <span className="text-green-400 font-semibold text-lg">
                          ${currentItem?.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {featuredItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleChangeIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? 'bg-blue-500 w-6'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={goToPrevious}
                  disabled={isTransitioning}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goToNext}
                  disabled={isTransitioning}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {items.length}
              </div>
              <div className="text-gray-400">Total Items</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {Array.from(new Set(items.map(i => i.category))).length}
              </div>
              <div className="text-gray-400">Categories</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-green-400 mb-2">
                ${items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(0)}
              </div>
              <div className="text-gray-400">Total Value</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
