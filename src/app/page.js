"use client";
import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [hoveredCourse, setHoveredCourse] = useState(null);

  const courses = [
    {
      id: 1,
      title: 'Fundamentals Of Product Management: From Idea To Launch',
      chapters: [
        'Ch1: Introduction To Product Management',
        'Ch2: Market Research And Competitor Analysis',
        'Ch3: Development Of Product Strategy',
        'Ch4: Agile And Scrum In Product Management',
        'Ch5: Team And Process Management',
        'Ch6: MVP And Product Launch',
        'Ch7: Fundamentals Of Product Analytics',
        'Ch8: Final Project: Creating A Strategy For A New Product'
      ],
      progress: 5,
      exercises: 0
    },
    {
      id: 2,
      title: 'Advanced Product Management: Growth, Metrics And Scaling',
      progress: 0,
      exercises: 0
    },
    {
      id: 3,
      title: 'AI In Product Management: How To Use Technology To Create Successful Products',
      progress: 0,
      exercises: 0
    }
  ];

  return (
    <main className="min-h-screen bg-[#EFE2BA] p-8 font-sans">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-[#f13c20]">ProductMind</h1>
        <div className="flex gap-4 text-[#d62828]">
          <a href="#" className="hover:underline">SignIn</a>
          <a href="#" className="hover:underline">Login</a>
        </div>
      </header>

      <input type="text" placeholder="Find your course" className="w-full p-4 rounded-full mb-8 bg-[#C5CBE3] text-lg text-[#4056a1] focus:outline-none focus:ring-2" />

      {courses.map(course => (
        <div key={course.id}
             onMouseEnter={() => course.chapters && setHoveredCourse(course.id)}
             onMouseLeave={() => setHoveredCourse(null)}
             className={`p-6 bg-[#C5CBE3] rounded-2xl mb-6 cursor-pointer shadow-lg hover:shadow-xl transition-transform duration-300 relative group ${hoveredCourse === course.id ? 'translate-y-0' : 'translate-y-0'}`}>
          <h2 className="text-2xl font-semibold text-[#4056a1] group-hover:text-[#F13C20]">{course.title}</h2>
          {hoveredCourse === course.id && course.chapters && (
            <div className="bg-[#C5CBE3] rounded-2xl p-6 mt-4 animate-fadeIn">
              
              <ul className="list-none pl-5 space-y-2 text-[#4056A1]">
                {course.chapters.map((chapter, index) => (
                  <li key={index}>{chapter}</li>
                ))}
              </ul>
              <button className="mt-4 px-4 py-2 bg-[#d62828] text-[#EFE2BA] rounded-full hover:bg-[#d62828] transition">Enter Course</button>
            </div>
          )}
          <div className="text-right text-sm text-[#4056a1]">
            Lessons Learned: {course.progress}/10
          </div>
          <div className="text-right text-sm text-[#4056a1]">Exercises Completed: {course.exercises}/10</div>
        </div>
      ))}
    </main>
  );
}
