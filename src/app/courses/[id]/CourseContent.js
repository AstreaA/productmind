"use client";
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar.js';
import Image from 'next/image';

export default function CourseContent() {
  const params = useParams();
  const courseId = params.id;

  const course = {
    id: courseId,
    title: 'Fundamentals Of Product Management: From Idea To Launch',
    currentChapter: 'Chapter 1',
    currentLesson: 'Lesson 1',
    content: {
      title: 'Introduction To Product Management',
      sections: [
        {
          title: '1. Who is a product manager?',
          content: `A Product Manager (PM) is a specialist who is responsible for product development, defines its strategy and leads it from idea to realization. A PM works at the intersection of business, technology and user needs.

The key tasks of a product manager are:
• Defining the product vision and product development strategy.
• Analyzing the market, competitors and user needs.
• Forming and prioritizing the backlog (list of tasks and features).
• Interaction with developers, designers, marketers.
• Product launch, hypothesis testing, feedback collection.`
        },
        {
          title: '2. Basic skills of a product manager',
          content: `To effectively manage a product, a PM must have the following skills:
• Analytical thinking - ability to analyze data, metrics and user behavior.
• Communication skills - working with teams, stakeholders and users.
• Business thinking - understanding product economics, calculating unit economics.
• Knowledge of UX/UI fundamentals - understanding user experience and interfaces.
• Project management - Agile, Scrum, Kanban skills.`
        },
        {
          title: '3. Product life cycle',
          content: `Any product goes through several stages:
1. Research and idea generation - studying the market, competitors, identifying user problems.
2. Strategy development - defining the value proposition, audience, business model.
3. Design and development - prototyping, roadmap building, working with the team.
4. Launch MVP (Minimum Viable Product) - testing the basic version of the product.
5. Growth and development - gathering analytics, introducing new features, attracting users.
6. Maturity and scaling - search for new markets, product optimization.
7. Product sunset - if the product loses relevance, it may be withdrawn from the market.`
        }
      ]
    },
    test: {
      title: 'Test 1: Fundamentals Of Product Management',
      questions: [
        {
          question: '1. Who Is A Product Manager?',
          options: [
            'A Developer Who Writes The Product Code.',
            'A Designer Who Creates The Product Interface.',
            'A Specialist Who Manages The Product Strategy',
            'A Financial Analyst For A Company.'
          ]
        },
        {
          question: '2. What Are The Key Skills A Product Manager Needs?',
          options: [
            'Communication Skills',
            'Programming Skills',
            'Analytical Thinking',
            'Ability To Manage A Team',
            'Strong Knowledge Of Accounting'
          ]
        },
        {
          question: '3. What Is An MVP?',
          options: [
            'Marketing Video Product',
            'Maximum Viable Product',
            'Multifunctional Program Version',
            'Minimum Viable Product'
          ]
        }
      ]
    }
  };

  return (
    <main className="min-h-screen bg-[#EFE2BA] p-8 font-sans">
      <Navbar />
      
      {/* Course Header */}
      <div className="bg-[#F13C20] text-white p-4 rounded-xl mb-6 flex items-center justify-between">
        <h1 className="text-xl">{course.title}</h1>
        <div className="flex gap-4">
          <select className="bg-[#4056A1] text-white px-4 py-2 rounded-lg">
            <option>{course.currentChapter}</option>
          </select>
          <select className="bg-[#4056A1] text-white px-4 py-2 rounded-lg">
            <option>{course.currentLesson}</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Lesson Content */}
        <div className="bg-[#C5CBE3] rounded-xl p-6">
          <h2 className="text-2xl text-[#F13C20] mb-6">{course.content.title}</h2>
          {course.content.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-[#4056A1] font-semibold mb-2">{section.title}</h3>
              <p className="text-[#4056A1] whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Right Column - Test */}
        <div className="bg-[#C5CBE3] rounded-xl p-6">
          <h2 className="text-2xl text-[#4056A1] mb-6">{course.test.title}</h2>
          {course.test.questions.map((q, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-[#4056A1] font-semibold mb-4">{q.question}</h3>
              <div className="space-y-2">
                {q.options.map((option, optIndex) => (
                  <button
                    key={optIndex}
                    className="w-full text-left p-3 bg-[#E6A5A0] text-white rounded-lg hover:bg-[#F13C20] transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button className="w-full bg-[#4056A1] text-white py-3 rounded-lg mt-4 hover:bg-[#2E3E7D] transition-colors">
            Submit Answers
          </button>
        </div>
      </div>

      {/* AI Assistant */}
      <div className="bg-[#C5CBE3] rounded-xl p-6 mt-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 relative">
            <Image
              src="/images/ai-assistant.png"
              alt="AI Assistant"
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          <p className="text-[#4056A1]">
            Having Trouble? I, AI-Assistant, You Can Ask Me Your Question About The Topic Of The Lesson And I Will Try To Help You.
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Ask AI-Assistant A Quastion"
            className="w-full p-4 pr-12 rounded-full bg-white text-[#4056A1]"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2">
            <Image
              src="/images/send.png"
              alt="Send"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
    </main>
  );
} 