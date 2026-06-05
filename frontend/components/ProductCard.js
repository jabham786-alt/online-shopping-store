'use client';
import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import api from '../lib/api';
import { useAuthStore } from '../lib/authStore';

export default function ProductCard({ product }) {
  const { token } = useAuthStore();
  const [loading, setLoading] = React.useState(false);

  const handleAddToCart = async () => {
    if (!token) {
      window.location.href = '/auth/login';
      return;
    }

    setLoading(true);
    try {
      await api.post('/cart/add', { productId: product._id, quantity: 1 });
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
      <Link href={`/products/${product._id}`}>
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg hover:opacity-90 transition-opacity" />
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-bold text-lg hover:text-blue-500 cursor-pointer truncate">{product.name}</h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className={i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.numReviews})</span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-2xl font-bold text-blue-500">${product.price}</p>
          <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={loading || product.stock === 0}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingCart size={18} />
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
