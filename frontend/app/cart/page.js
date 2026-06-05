'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import api from '../../lib/api';
import { useAuthStore } from '../../lib/authStore';

const fetcher = (url) => api.get(url).then(res => res.data);

export default function CartPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { data: cartData, mutate } = useSWR(
    token ? '/cart' : null,
    fetcher
  );

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login</h1>
          <Link href="/auth/login" className="text-blue-500 hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      await api.put(`/cart/update/${itemId}`, { quantity });
      mutate();
    } catch (error) {
      alert('Failed to update');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/cart/remove/${itemId}`);
      mutate();
    } catch (error) {
      alert('Failed to remove');
    }
  };

  const cart = cartData?.cart;
  if (!cart) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cart.items.length === 0 ? (
          <div className="bg-white p-8 rounded-lg text-center">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link href="/products" className="text-blue-500 hover:underline">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                {cart.items.map((item) => (
                  <div key={item._id} className="p-6 border-b flex gap-4 items-start">
                    <img src={item.productId?.image} alt={item.productId?.name} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.productId?.name}</h3>
                      <p className="text-gray-500">${item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => handleUpdateQuantity(item._id, Math.max(1, item.quantity - 1))} className="px-2 py-1 bg-gray-200 rounded">-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                        <button onClick={() => handleRemoveItem(item._id)} className="ml-auto text-red-500 hover:text-red-700">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-4">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
