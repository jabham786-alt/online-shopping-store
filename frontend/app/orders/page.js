'use client';
import React from 'react';
import useSWR from 'swr';
import api from '../../lib/api';
import { useAuthStore } from '../../lib/authStore';

const fetcher = (url) => api.get(url).then(res => res.data);

export default function OrdersPage() {
  const { token } = useAuthStore();
  const { data, error, isLoading } = useSWR(
    token ? '/orders' : null,
    fetcher
  );

  if (!token) {
    return <div className="min-h-screen flex items-center justify-center">Please login first</div>;
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const orders = data?.orders || [];

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg text-center">
            <p className="text-gray-500">You haven't placed any orders yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Order #{order._id.slice(-6)}</h3>
                    <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-white font-bold ${
                    order.status === 'delivered' ? 'bg-green-500' :
                    order.status === 'shipped' ? 'bg-blue-500' :
                    order.status === 'cancelled' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-gray-600 mb-2">Items: {order.items.length}</p>
                  <p className="font-bold text-lg">Total: ${order.totalPrice.toFixed(2)}</p>
                  {order.trackingNumber && (
                    <p className="text-gray-600 text-sm mt-2">Tracking: {order.trackingNumber}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
