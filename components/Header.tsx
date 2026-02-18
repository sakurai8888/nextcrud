'use client';

import { useEffect, useState } from 'react';

interface User {
  userId: string;
  email: string;
  role: 'admin' | 'viewer';
}

export default function Header({ onLogout }: { onLogout: () => void }) {
  const [user, setUser] = useState<User | null>(null);

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

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">NextCRUD</h1>
          <p className="text-sm text-gray-300">MongoDB CRUD Application</p>
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
