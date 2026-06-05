'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to ShopHub</h1>
          <p className="text-xl mb-8">Amazing products at unbeatable prices</p>
          <Link href="/products">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
              Shop Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
