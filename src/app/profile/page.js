'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isUserLoggedIn, getUserData } from '@/lib/auth';
import { getUserProgress } from '@/lib/indexedDB';

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      
      // Check if user is logged in
      if (!isUserLoggedIn()) {
        router.push('/auth/login');
        return;
      }

      // Get user data
      const user = getUserData();
      if (!user) {
      router.push('/auth/login');
      return;
    }

      setUserData(user);
      
      try {
        // Get user progress
        const progress = await getUserProgress(user.id);
        setProgressData(progress);
    } catch (error) {
        console.error('Error getting user progress:', error);
        setProgressData({ hasStartedCourses: false, courses: [] });
      } finally {
        setLoading(false);
    }
    }
    
    fetchUserData();
  }, [router]);

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthChange = () => {
      if (!isUserLoggedIn()) {
        router.push('/auth/login');
      } else {
        setUserData(getUserData());
      }
    };
    
    window.addEventListener('auth-state-changed', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, [router]);

  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-[#EFE2BA] flex justify-center items-center">
        <div className="text-center">
          <p className="mt-4 text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFE2BA] flex flex-col">
      <div className="container mx-auto flex-grow p-8">
        <div className="bg-[#4056A1] rounded-lg shadow-md p-8 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Your Profile</h1>
          
          <div className="mb-6">
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-[#C5CBE3]">Name</p>
                <p className="font-medium text-white">{userData.name}</p>
              </div>
              <div>
                <p className="text-sm text-[#C5CBE3]">Email</p>
                <p className="font-medium text-white">{userData.email}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Your Progress</h2>
            
            {progressData && !progressData.hasStartedCourses ? (
              <div className="bg-[#C5CBE3] rounded-lg p-6 text-center">
                <p className="text-[#4056A1] font-medium">
                  There's no course started yet
                </p>
                <button 
                  onClick={() => router.push('/')}
                  className="mt-4 px-4 py-2 bg-[#F13C20] text-white rounded-md hover:bg-[#d62828] transition-colors"
                >
                  Explore Courses
              </button>
            </div>
            ) : (
              <div className="bg-[#C5CBE3] rounded-lg p-4">
                <div className="mb-4">
                  <p className="text-[#4056A1] mb-1 font-medium">Lessons Learned: 0/10</p>
                  <div className="w-full h-2 bg-[#EFE2BA] rounded-full overflow-hidden">
                    <div className="h-full bg-[#F13C20] rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
                
                <div>
                  <p className="text-[#4056A1] mb-1 font-medium">Exercise Completed: 0/10</p>
                  <div className="w-full h-2 bg-[#EFE2BA] rounded-full overflow-hidden">
                    <div className="h-full bg-[#F13C20] rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 