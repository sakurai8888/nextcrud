'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface User {
  userId: string;
  email: string;
  role: 'admin' | 'viewer';
}

export default function Header({ onLogout }: { onLogout: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => setUser(null));
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="w-full bg-gradient-to-r from-gray-800 via-gray-800 to-gray-900 text-white shadow-lg border-b border-gray-700">
      <div className="w-full max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-9 w-9 shrink-0">
              <defs>
                <linearGradient id="hdr-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#3B82F6' }} />
                  <stop offset="100%" style={{ stopColor: '#8B5CF6' }} />
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="7" fill="url(#hdr-bg)" />
              <path d="M8 10h6v6H8zM18 10h6v6h-6zM8 20h6v2H8zM18 20h6v2h-6z" fill="white" opacity="0.95" />
              <circle cx="24" cy="8" r="4" fill="#22D3EE" />
              <path d="M22.5 8l1 1 2-2" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Vault</span>
                <span className="text-white">Grid</span>
              </h1>
              <p className="text-xs text-gray-400">Inventory Management Dashboard</p>
            </div>
          </Link>

          {/* Navigation */}
          {user && (
            <nav className="flex items-center gap-1">
              <Link
                href="/home"
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/home') || isActive('/')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Home
              </Link>
              <Link
                href="/inventory"
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/inventory')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Inventory
              </Link>
            </nav>
          )}
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs text-gray-400 capitalize">
                Role: {user.role}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
