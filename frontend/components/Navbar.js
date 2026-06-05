'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/authStore';
import { ShoppingCart, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { token, setToken } = useAuthStore();

  const handleLogout = () => {
    setToken(null);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-500">🛍️ ShopHub</Link>
        
        <div className="flex gap-8 items-center">
          <Link href="/products" className="hover:text-blue-500">Products</Link>
          <Link href="/cart" className="hover:text-blue-500 flex items-center gap-2">
            <ShoppingCart size={20} /> Cart
          </Link>
          
          {token ? (
            <div className="flex gap-4 items-center">
              <Link href="/profile" className="hover:text-blue-500 flex items-center gap-2">
                <User size={20} /> Profile
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700">
                <LogOut size={20} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/auth/login" className="text-blue-500 hover:underline">Login</Link>
              <Link href="/auth/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
