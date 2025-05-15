'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/indexedDB';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Register user directly with IndexedDB
      const newUser = await registerUser(name, email, password);

      // Successful registration
      router.push('/auth/login'); // Redirect to login page
    } catch (error) {
      setError(typeof error === 'string' ? error : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFE2BA] flex justify-center items-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#F13C20] mb-8">ProductMind</h1>
        
        <div className="bg-[#4056A1] rounded-lg p-8 shadow-md">
          <h2 className="text-2xl text-white font-semibold mb-6 text-center">Registration</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                className="w-full bg-[#C5CBE3] rounded-md py-3 px-4 text-gray-800 placeholder-gray-500"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <input
                type="email"
                className="w-full bg-[#C5CBE3] rounded-md py-3 px-4 text-gray-800 placeholder-gray-500"
                placeholder="E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <input
                type="password"
                className="w-full bg-[#C5CBE3] rounded-md py-3 px-4 text-gray-800 placeholder-gray-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#D7816A] hover:bg-[#bd6d5a] text-white font-medium py-3 px-4 rounded-md transition duration-300 mb-4"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create A Profile'}
            </button>
            
            <Link href="/auth/login">
              <div className="w-full bg-[#F13C20] hover:bg-[#d62828] text-white font-medium py-3 px-4 rounded-md transition duration-300 text-center cursor-pointer">
                Login
              </div>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
} 