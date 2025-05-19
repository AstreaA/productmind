'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isUserLoggedIn, getUserData } from '@/lib/auth';
import { getUserProgress } from '@/lib/indexedDB';
import Image from 'next/image';

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Список курсов (как на главной)
  const courses = [
    {
      id: 1,
      title: 'Fundamentals Of Product Management: From Idea To Launch',
      icon: '/images/course1.png',
    },
    {
      id: 2,
      title: 'Advanced Product Management: Growth, Metrics And Scaling',
      icon: '/images/course2.png',
    },
    {
      id: 3,
      title: 'AI In Product Management: How To Use Technology To Create Successful Products',
      icon: '/images/course3.png',
    },
  ];

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
            {progressData && (!progressData.hasStartedCourses || !progressData.courses.length) ? (
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
              <div className="space-y-6">
                {progressData.courses.map((courseProgress) => {
                  const courseInfo = courses.find(c => c.id === courseProgress.course_id);
                  if (!courseInfo) return null;
                  const theoriesRead = courseProgress.theories_read || 0;
                  const exercisesCompleted = courseProgress.exercises_completed || 0;
                  return (
                    <div key={courseInfo.id} className="bg-[#C5CBE3] rounded-2xl p-6 shadow-md flex items-start">
                      {/* Иконка курса */}
                      <div className="w-20 h-20 mr-4 flex-shrink-0 rounded-full bg-[#C5CBE3] flex items-center justify-center overflow-hidden">
                        <Image 
                          src={courseInfo.icon}
                          alt={courseInfo.title}
                          width={50}
                          height={50}
                        />
                      </div>
                      {/* Контент курса */}
                      <div className="flex-grow">
                        <h2 className="text-xl font-semibold text-[#4056A1] mb-2">{courseInfo.title}</h2>
                        <div className="mb-2">
                          <p className="text-xs mb-1 text-[#4056A1]">
                            Lessons Learned: {theoriesRead}/10
                          </p>
                          <div className="w-40 h-2 bg-[#EFE2BA] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#F13C20] rounded-full" 
                              style={{ width: `${(theoriesRead / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs mb-1 text-[#4056A1]">
                            Exercise Completed: {exercisesCompleted}/10
                          </p>
                          <div className="w-40 h-2 bg-[#EFE2BA] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#F13C20] rounded-full" 
                              style={{ width: `${(exercisesCompleted / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 