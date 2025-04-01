"use client";
import { useParams } from 'next/navigation';

export default function CoursePage() {
  const { courseId } = useParams();

  return (
    <main className="min-h-screen p-8 bg-[#f9f5f0]">
      <h1 className="text-3xl font-bold mb-4">Course ID: {courseId}</h1>
      <p>Here you can access detailed content for course {courseId}.</p>
    </main>
  );
}