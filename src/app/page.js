"use client";
import { useState } from 'react';
import Link from 'next/link';

import Image from 'next/image';
import Navbar from './components/Navbar.js';

export default function Home() {
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      chapters: ['Ch1: Introduction To Product Management',
        'Ch2: Market Research And Competitor Analysis',
        'Ch3: Development Of Product Strategy',
        'Ch4: Agile And Scrum In Product Management',
        'Ch5: Team And Process Management',
        'Ch6: MVP And Product Launch',
        'Ch7: Fundamentals Of Product Analytics',
        'Ch8: Final Project: Creating A Strategy For A New Product'],
      progress: 0,
      exercises: 0
    },
    {
      id: 3,
      title: 'AI In Product Management: How To Use Technology To Create Successful Products',
      chapters: ['Ch1: Introduction To Product Management',
        'Ch2: Market Research And Competitor Analysis',
        'Ch3: Development Of Product Strategy',
        'Ch4: Agile And Scrum In Product Management',
        'Ch5: Team And Process Management',
        'Ch6: MVP And Product Launch',
        'Ch7: Fundamentals Of Product Analytics',
        'Ch8: Final Project: Creating A Strategy For A New Product'],
      progress: 0,
      exercises: 0
    }
  ];
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.chapters?.some(chapter => chapter.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  
  
  return (
    <main className="min-h-screen bg-[#EFE2BA] p-8 font-sans">
      <Navbar />
      
      <input
        type="text"
        placeholder="Find your course"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-4 rounded-full mb-8 bg-[#C5CBE3] text-lg focus:outline-none focus:ring-2 focus:ring-[#e63946] text-[#4056a1]"
      />

      {filteredCourses.map(course => (
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
              
            </div>
          )}
          <ul className="mt-4 text-right text-sm text-[#4056a1]">
            
            <li>Lessons Learned: {course.progress}/10</li>

            <li>Exercises Completed: {course.exercises}/10</li>

            <li><button
            
            className="mt-2 mb-2 px-4 py-2 bg-[#d62828] text-[#EFE2BA] rounded-full hover:bg-[#d62828] transition"><Link href={`/course/${course.id}.js`}>Enter Course</Link></button></li>
          </ul>
          </div>
      ))}
    </main>
  );
}
