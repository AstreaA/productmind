"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const courses = [
    {
      id: 1,
      title: 'Fundamentals Of Product Management: From Idea To Launch',
      icon: '/images/course1.png',
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
      icon: '/images/course2.png',
      chapters: [
        'Ch1: Product growth: key strategies',
        'Ch2: Working with metrics and unit economics',
        'Ch3: Chips and roadmap management',
        'Ch4: Agile methodologies in practice',
        'Ch5: Automation of work of a sales manager',
        'Ch6: Working with user research',
        'Ch7: Launching international products',
        'Ch8: Final case - development of a growth plan'
      ],
      progress: 0,
      exercises: 0
    },
    {
      id: 3,
      title: 'AI In Product Management: How To Use Technology To Create Successful Products',
      icon: '/images/course3.png',
      chapters: [
        'Ch1: Introduction to AI products',
        'Ch2: AI and product analytics',
        'Ch3: ChatGPT and AI assistants in products',
        'Ch4: User experience automation',
        'Ch5: Managing AI teams',
        'Ch6: Ethics and limitations of AI products',
        'Ch7: Implementation of AI in business',
        'Ch8: Final project - creation of an AI solution'
      ],
      progress: 0,
      exercises: 0
    }
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.chapters?.some(chapter => chapter.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <main>
      {/* Search Bar */}
      <div className="relative mb-8 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Find your course"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 pl-6 pr-12 rounded-full bg-[#C5CBE3] text-[#4056A1] text-lg focus:outline-none"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <Image 
            src="/images/send2.png"
            alt="Search"
            width={24}
            height={24}
          />
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {filteredCourses.map(course => (
          <div 
            key={course.id}
            onMouseEnter={() => course.chapters && setHoveredCourse(course.id)}
            onMouseLeave={() => setHoveredCourse(null)}
            className="bg-[#C5CBE3] rounded-2xl p-6 shadow-md"
          >
            <div className="flex items-start">
              {/* Course Icon */}
              <div className="w-20 h-20 mr-4 flex-shrink-0 rounded-full bg-[#C5CBE3] flex items-center justify-center overflow-hidden">
                <Image 
                  src={course.icon}
                  alt={course.title}
                  width={50}
                  height={50}
                />
              </div>
              
              {/* Course Content */}
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-[#4056A1] mb-2">{course.title}</h2>
                
                {hoveredCourse === course.id && (
                  <div className="space-y-1 text-[#4056A1] text-sm">
                    {course.chapters.map((chapter, idx) => (
                      <p key={idx}>{chapter}</p>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Progress Metrics */}
              <div className="ml-4 flex flex-col items-end">
                <div className="mb-2">
                  <p className="text-xs mb-1">Lessons Learned: {course.progress}/10</p>
                  <div className="w-40 h-2 bg-[#EFE2BA] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#F13C20] rounded-full" 
                      style={{ width: `${(course.progress / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs mb-1">Exercise Completed: {course.exercises}/10</p>
                  <div className="w-40 h-2 bg-[#EFE2BA] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#F13C20] rounded-full" 
                      style={{ width: `${(course.exercises / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <Link 
                  href={`/courses/${course.id}`}
                  className="px-4 py-2 bg-[#F13C20] text-[#EFE2BA] rounded-full text-sm font-medium"
                >
                  Enter Course
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
