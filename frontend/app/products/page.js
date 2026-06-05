'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import ProductCard from '../../components/ProductCard';
import api from '../../lib/api';

const fetcher = (url) => api.get(url).then(res => res.data);

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);

  const queryParams = new URLSearchParams({
    ...(search && { search }),
    ...(category && { category }),
    ...(sortBy && { sortBy }),
    page,
    limit: 12,
  });

  const { data, error, isLoading } = useSWR(
    `/products?${queryParams}`,
    fetcher
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Products</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          
          <button
            onClick={() => { setSearch(''); setCategory(''); setSortBy(''); setPage(1); }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">Error loading products</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {data?.products?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            {data?.pagination?.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-lg ${
                      page === p
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
