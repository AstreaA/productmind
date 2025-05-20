'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isUserLoggedIn, getUserData, clearUserSession } from '@/lib/auth';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const menuRef = useRef(null);
  const router = useRouter();

  // Check auth status and update state
  const checkAndUpdateAuthStatus = () => {
    const loggedIn = isUserLoggedIn();
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      setUserData(getUserData());
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    // Check initial auth status
    checkAndUpdateAuthStatus();
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      checkAndUpdateAuthStatus();
    };
    
    window.addEventListener('auth-state-changed', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    clearUserSession();
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <Link href="/" className="text-2xl font-bold text-[#F13C20]">
        ProductMind
      </Link>
      
      {isLoggedIn ? (
        <div className="flex items-center relative" ref={menuRef}>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#F13C20] font-medium flex items-center gap-4"
          >
            <span>Menu</span>
            <div className="w-12 h-12 rounded-full bg-[#C5CBE3] flex items-center justify-center">
              <div className="text-[#4056A1] text-xl">:)</div>
            </div>
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 top-14 w-60 bg-[#4056A1] rounded-lg shadow-lg py-4 z-10">
              
              
              <Link href="/profile">
                <div className="px-6 py-2 text-[#EFE2BA] hover:bg-[#3A4D8F] cursor-pointer">
                  My Profile
                </div>
              </Link>
              
              <div 
                onClick={handleLogout}
                className="px-6 py-2 text-[#EFE2BA] hover:bg-[#3A4D8F] cursor-pointer"
              >
                Logout
              </div>
            </div>
          )}
        </div>
      ) : (
      <div className="flex items-center">
        <Link href="/auth/login" className="text-[#F13C20] font-medium mr-4 hover:text-[#d62828]">
          Login/SignIn
        </Link>
        <div className="w-10 h-10 rounded-lg bg-[#C5CBE3] flex items-center justify-center border-2 border-[#4056A1] relative">
          <div className="relative w-6 h-6">
            <Image 
              src="/images/question.png"
              alt="Help"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
      )}
    </div>
  );
} 