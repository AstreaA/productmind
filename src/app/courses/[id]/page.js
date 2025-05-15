'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isUserLoggedIn } from '@/lib/auth';
import CourseContent from './CourseContent';

export default function CoursePage() {
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    if (!isUserLoggedIn()) {
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <div className="p-6">
      <CourseContent />
    </div>
  );
} 