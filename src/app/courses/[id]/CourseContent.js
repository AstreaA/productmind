"use client";
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar.js';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function CourseContent() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  // Состояния для выбранной главы и урока
  const [selectedChapter, setSelectedChapter] = useState('Chapter 1');
  const [selectedLesson, setSelectedLesson] = useState('Lesson 1');
  
  // Состояния для теста
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // Состояния для чата
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Правильные ответы
  const correctAnswers = {
    '1': 'A Specialist Who Manages The Product Strategy',
    '2': 'Communication Skills',
    '3': 'Minimum Viable Product'
  };

  const chapters = [
    {
      id: 'Chapter 1',
      title: 'Chapter 1',
      lessons: [
        { id: 'Lesson 1', title: 'Lesson 1' },
        { id: 'Lesson 2', title: 'Lesson 2' },
        { id: 'Lesson 3', title: 'Lesson 3' }
      ]
    },
    {
      id: 'Chapter 2',
      title: 'Chapter 2',
      lessons: [
        { id: 'Lesson 1', title: 'Lesson 1' },
        { id: 'Lesson 2', title: 'Lesson 2' },
        { id: 'Lesson 3', title: 'Lesson 3' }
      ]
    },
    {
      id: 'Chapter 3',
      title: 'Chapter 3',
      lessons: [
        { id: 'Lesson 1', title: 'Lesson 1' },
        { id: 'Lesson 2', title: 'Lesson 2' },
        { id: 'Lesson 3', title: 'Lesson 3' }
      ]
    }
  ];

  const course = {
    id: courseId,
    title: 'Fundamentals Of Product Management: From Idea To Launch',
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

  // Сценарии ответов AI для разных тем
  const aiResponses = {
    'product manager': {
      keywords: ['product manager', 'pm', 'product management'],
      response: "A Product Manager is a professional who is responsible for the product strategy, roadmap, and feature definition. They work at the intersection of business, technology, and user experience to create successful products."
    },
    'mvp': {
      keywords: ['mvp', 'minimum viable product', 'product launch'],
      response: "An MVP (Minimum Viable Product) is the most basic version of a product that can be released to users while still providing value. It helps validate ideas and gather user feedback early in the development process."
    },
    'agile': {
      keywords: ['agile', 'scrum', 'sprint'],
      response: "Agile is an iterative approach to project management and software development that helps teams deliver value to their customers faster and with fewer headaches. It focuses on continuous improvement and adapting to change."
    },
    'default': {
      response: "I'm here to help you understand product management concepts. Could you please rephrase your question or ask about a specific topic like product strategy, user research, or product development?"
    }
  };

  // Функция для определения ответа AI на основе сообщения пользователя
  const getAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [topic, data] of Object.entries(aiResponses)) {
      if (topic === 'default') continue;
      
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return data.response;
      }
    }
    
    return aiResponses.default.response;
  };

  // Обработчик изменения главы
  const handleChapterChange = (e) => {
    const newChapter = e.target.value;
    setSelectedChapter(newChapter);
    setSelectedLesson('Lesson 1'); // Сброс урока на первый при смене главы
    router.push(`/courses/${courseId}?chapter=${newChapter}&lesson=Lesson 1`);
  };

  // Обработчик изменения урока
  const handleLessonChange = (e) => {
    const newLesson = e.target.value;
    setSelectedLesson(newLesson);
    router.push(`/courses/${courseId}?chapter=${selectedChapter}&lesson=${newLesson}`);
  };

  // Получаем список уроков для выбранной главы
  const currentChapterLessons = chapters.find(ch => ch.id === selectedChapter)?.lessons || [];

  // Обработчик выбора ответа
  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  // Обработчик отправки теста
  const handleTestSubmit = () => {
    let correctCount = 0;
    Object.entries(selectedAnswers).forEach(([questionIndex, answer]) => {
      if (correctAnswers[questionIndex] === answer) {
        correctCount++;
      }
    });
    
    const scorePercentage = (correctCount / Object.keys(correctAnswers).length) * 100;
    setScore(scorePercentage);
    setTestSubmitted(true);
  };

  // Обработчик отправки сообщения
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Добавляем сообщение пользователя
    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Отправляем запрос к API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      
      // Добавляем ответ AI
      setMessages(prev => [...prev, { type: 'ai', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Прокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <main className="min-h-screen bg-[#EFE2BA] p-8 font-sans">
      <Navbar />
      
      {/* Course Header */}
      <div className="bg-[#F13C20] text-white p-4 rounded-xl mb-6 flex items-center justify-between">
        <h1 className="text-xl text-[#EFE2BA]">{course.title}</h1>
        <div className="flex gap-4">
          <select 
            value={selectedChapter}
            onChange={handleChapterChange}
            className="bg-[#4056A1] text-[#EFE2BA] px-4 py-2 rounded-lg"
          >
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.title}
              </option>
            ))}
          </select>
          <select 
            value={selectedLesson}
            onChange={handleLessonChange}
            className="bg-[#4056A1] text-[#EFE2BA] px-4 py-2 rounded-lg"
          >
            {currentChapterLessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
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
                    onClick={() => handleAnswerSelect(index + 1, option)}
                    className={`w-full text-center p-3 rounded-lg transition-colors
                      ${selectedAnswers[index + 1] === option 
                        ? 'bg-[#F13C20] text-[#EFE2BA]' 
                        : 'bg-[#E6A5A0] text-[#EFE2BA] hover:bg-[#F13C20]'}
                      ${testSubmitted && correctAnswers[index + 1] === option 
                        ? 'bg-green-500' 
                        : testSubmitted && selectedAnswers[index + 1] === option && correctAnswers[index + 1] !== option 
                          ? 'bg-gray-400' 
                          : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="space-y-4">
            <button 
              onClick={handleTestSubmit}
              className="w-full bg-[#4056A1] text-[#EFE2BA] py-3 rounded-lg hover:bg-[#2E3E7D] transition-colors"
            >
              Submit Answers
            </button>
            {testSubmitted && score !== null && (
              <div className={`text-center p-4 rounded-lg ${score >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Your score: {Math.round(score)}%
                {Math.round(score) >= 70 ? ' - Great job!' : ' - Keep practicing!'}
              </div>
            )}
          </div>
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

        {/* Chat Messages */}
        <div className="h-64 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-[#F13C20] text-[#EFE2BA]'
                    : 'bg-[#4056A1] text-[#EFE2BA]'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#4056A1] text-[#EFE2BA] p-3 rounded-lg">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="relative">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask AI-Assistant A Question"
            className="w-full p-4 pr-12 rounded-full text-[#4056A1] bg-[#EFE2BA]"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2"
            disabled={isLoading}
          >
            <Image
              src="/images/send.png"
              alt="Send"
              width={24}
              height={24}
            />
          </button>
        </form>
      </div>
    </main>
  );
} 