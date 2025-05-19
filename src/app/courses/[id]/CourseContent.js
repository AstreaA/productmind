"use client";
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { isUserLoggedIn, getUserData } from '@/lib/auth';
import { startCourse, markTheoryAsRead, markExerciseAsCompleted, getCourseTheory, getCourseExercises } from '@/lib/indexedDB';

export default function CourseContent() {
  const params = useParams();
  const router = useRouter();
  const courseId = parseInt(params.id, 10);

  // User and auth state
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Progress tracking
  const [theoryProgress, setTheoryProgress] = useState([]);
  const [exerciseProgress, setExerciseProgress] = useState([]);
  const [isTheoryRead, setIsTheoryRead] = useState(false);
  const [progressLoading, setProgressLoading] = useState(true);

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

  // ДОБАВЛЯЮ СОСТОЯНИЯ ДЛЯ ПРОЕКТНОГО ЗАДАНИЯ
  const [projectText, setProjectText] = useState("");
  const [projectSubmitted, setProjectSubmitted] = useState(false);
  const [projectFeedback, setProjectFeedback] = useState(null);
  const [projectLoading, setProjectLoading] = useState(false);

  // Правильные ответы
  const correctAnswers = {
    '1': 'A Specialist Who Manages The Product Strategy',
    '2': 'Communication Skills',
    '3': 'Minimum Viable Product'
  };

  const chapters = [
    {
      id: 'Chapter 1',
      title: 'Ch1: Introduction To Product Management',
      lessons: [
        { id: 'Lesson 1', title: 'Lesson 1' },
        { id: 'Lesson 2', title: 'Lesson 2' }
      ]
    },
    {
      id: 'Chapter 2',
      title: 'Ch2: Market Research And Competitor Analysis',
      lessons: [
        { id: 'Lesson 1', title: 'Lesson 1' },
        { id: 'Lesson 2', title: 'Lesson 2' }
      ]
    },
    {
      id: 'Chapter 3',
      title: 'Ch3: Development Of Product Strategy',
      lessons: [
        { id: 'Lesson 1', title: 'Lesson 1' },
        { id: 'Lesson 2', title: 'Lesson 2' }
      ]
    }
  ];

  const course = {
    id: courseId,
    title: 'Fundamentals Of Product Management: From Idea To Launch',
    content: selectedChapter === 'Chapter 2' ? {
      title: 'Market Research And Competitor Analysis',
      sections: [
        {
          title: '1. What is Market Research?',
          content: `Market research is the process of gathering, analyzing, and interpreting information about a market, including information about the target audience, competitors, and the industry as a whole.\n\nKey goals:\n• Understand customer needs and pain points.\n• Identify market trends and opportunities.\n• Reduce risks in product development.`
        },
        {
          title: '2. Types of Market Research',
          content: `There are two main types of market research:\n• Primary research: Collecting new data directly from potential customers (interviews, surveys, focus groups, observations).\n• Secondary research: Analyzing existing data (industry reports, competitor websites, public statistics, articles).\n\nBoth types are important for a comprehensive understanding of the market.`
        },
        {
          title: '3. Competitor Analysis',
          content: `Competitor analysis is the process of identifying your competitors and evaluating their strategies, strengths, and weaknesses.\n\nSteps:\n1. Identify direct and indirect competitors.\n2. Analyze their products, pricing, positioning, and marketing.\n3. Find gaps and opportunities for your product.\n\nTools: SWOT analysis, feature comparison tables, market mapping.`
        }
      ]
    } : {
      title: 'Introduction To Product Management',
      sections: [
        {
          title: '1. Who is a product manager?',
          content: `A Product Manager (PM) is a specialist who is responsible for product development, defines its strategy and leads it from idea to realization. A PM works at the intersection of business, technology and user needs.\n\nThe key tasks of a product manager are:\n• Defining the product vision and product development strategy.\n• Analyzing the market, competitors and user needs.\n• Forming and prioritizing the backlog (list of tasks and features).\n• Interaction with developers, designers, marketers.\n• Product launch, hypothesis testing, feedback collection.`
        },
        {
          title: '2. Basic skills of a product manager',
          content: `To effectively manage a product, a PM must have the following skills:\n• Analytical thinking - ability to analyze data, metrics and user behavior.\n• Communication skills - working with teams, stakeholders and users.\n• Business thinking - understanding product economics, calculating unit economics.\n• Knowledge of UX/UI fundamentals - understanding user experience and interfaces.\n• Project management - Agile, Scrum, Kanban skills.`
        },
        {
          title: '3. Product life cycle',
          content: `Any product goes through several stages:\n1. Research and idea generation - studying the market, competitors, identifying user problems.\n2. Strategy development - defining the value proposition, audience, business model.\n3. Design and development - prototyping, roadmap building, working with the team.\n4. Launch MVP (Minimum Viable Product) - testing the basic version of the product.\n5. Growth and development - gathering analytics, introducing new features, attracting users.\n6. Maturity and scaling - search for new markets, product optimization.\n7. Product sunset - if the product loses relevance, it may be withdrawn from the market.`
        }
      ]
    },
    test: selectedChapter === 'Chapter 2' ? {
      title: 'Test 2: Market Research And Competitor Analysis',
      questions: [
        {
          question: '1. What is the main goal of market research?',
          options: [
            'To copy competitors',
            'To understand customer needs and reduce risks',
            'To increase product price',
            'To hire more developers'
          ]
        },
        {
          question: '2. What is primary research?',
          options: [
            'Analyzing competitor websites',
            'Collecting new data directly from customers',
            'Reading industry reports',
            'Copying features from other products'
          ]
        },
        {
          question: '3. What is the first step in competitor analysis?',
          options: [
            'Set product price',
            'Identify direct and indirect competitors',
            'Launch MVP',
            'Create a marketing plan'
          ]
        }
      ]
    } : {
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

  // Load user data and auth status
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = isUserLoggedIn();
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        setUserData(getUserData());
      } else {
        router.push('/auth/login');
      }
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('auth-state-changed', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, [router]);

  // Start course and load progress
  useEffect(() => {
    const loadProgress = async () => {
      if (!isLoggedIn || !userData) return;
      setProgressLoading(true);
      try {
        await startCourse(userData.id, courseId);
        const theory = await getCourseTheory(userData.id, courseId);
        const exercises = await getCourseExercises(userData.id, courseId);
        setTheoryProgress(theory);
        setExerciseProgress(exercises);
        // DEBUG LOG
        console.log('loadProgress:', { userId: userData.id, theory, exercises });
        const currentChapterNum = parseInt(selectedChapter.split(' ')[1], 10);
        const currentLessonNum = parseInt(selectedLesson.split(' ')[1], 10);
        const lessonId = (currentChapterNum - 1) * 3 + currentLessonNum;
        const isRead = theory.some(t => t.chapter_id === lessonId);
        setIsTheoryRead(isRead);
      } catch (error) {
        console.error('Error loading course progress:', error);
      } finally {
        setProgressLoading(false);
      }
    };
    loadProgress();
  }, [isLoggedIn, userData, courseId, selectedChapter, selectedLesson]);

  // Mark current theory as read
  const markCurrentTheoryAsRead = async () => {
    if (!isLoggedIn || !userData || isTheoryRead) return;
    try {
      const currentChapterNum = parseInt(selectedChapter.split(' ')[1], 10);
      const currentLessonNum = parseInt(selectedLesson.split(' ')[1], 10);
      const lessonId = (currentChapterNum - 1) * 3 + currentLessonNum;
      await markTheoryAsRead(userData.id, courseId, lessonId);
      setIsTheoryRead(true);
      const theory = await getCourseTheory(userData.id, courseId);
      setTheoryProgress(theory);
      // DEBUG LOG
      console.log('markCurrentTheoryAsRead:', { userId: userData.id, theory });
    } catch (error) {
      console.error('Error marking theory as read:', error);
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
  const handleTestSubmit = async () => {
    let correctCount = 0;
    Object.entries(selectedAnswers).forEach(([questionIndex, answer]) => {
      if (correctAnswers[questionIndex] === answer) {
        correctCount++;
      }
    });
    const scorePercentage = (correctCount / Object.keys(correctAnswers).length) * 100;
    setScore(scorePercentage);
    setTestSubmitted(true);
    if (scorePercentage >= 70 && isLoggedIn && userData) {
      try {
        const currentChapterNum = parseInt(selectedChapter.split(' ')[1], 10);
        const exerciseId = currentChapterNum;
        await markExerciseAsCompleted(userData.id, courseId, exerciseId);
        const exercises = await getCourseExercises(userData.id, courseId);
        setExerciseProgress(exercises);
        // DEBUG LOG
        console.log('markExerciseAsCompleted:', { userId: userData.id, exercises });
      } catch (error) {
        console.error('Error marking exercise as completed:', error);
      }
    }
  };

  // Обработчик отправки сообщения
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use local AI response instead of API for demo
      const aiResponse = getAIResponse(userMessage);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: aiResponse
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: `Error: ${error.message}. Please try again.`
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


  async function handleProjectSubmit(e) {
    e.preventDefault();
    setProjectLoading(true);
    setProjectSubmitted(true);
    // Здесь должен быть реальный вызов OpenAI API
    // Ниже пример заглушки для демонстрации
    setTimeout(async () => {
      const feedback = {
        score: 8.5,
        comment: `✅ Хорошо описана ситуация и шаги PM.\n\n⚠️ Можно подробнее раскрыть анализ альтернатив и критерии успеха.\n\n✅ Итог: работа выполнена на высоком уровне!`
      };
      setProjectFeedback(feedback);
      setProjectLoading(false);
      // Если балл >= 7, засчитываем выполнение задания
      if (feedback.score >= 7 && isLoggedIn && userData) {
        // Для проектных заданий: номер упражнения = номер урока (Lesson 2 -> 2)
        await markExerciseAsCompleted(userData.id, courseId, 2);
        // Обновить прогресс
        const exercises = await getCourseExercises(userData.id, courseId);
        setExerciseProgress(exercises);
      }
    }, 1500);
  }

  return (
    <main>
      {/* Course Header */}
      <div className="bg-[#F13C20] text-white p-4 rounded-xl mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#EFE2BA]">{course.title}</h1>
        <div className="flex gap-4">
          <select 
            value={selectedChapter}
            onChange={handleChapterChange}
            className="bg-[#4056A1] text-[#EFE2BA] px-4 py-2 rounded-lg style-none min-w-[200px] font-bold appearance-none bg-no-repeat"
            style={{ 
              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23EFE2BA'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e\")",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
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
            className="bg-[#4056A1] text-[#EFE2BA] px-4 py-2 rounded-lg min-w-[200px] font-bold appearance-none bg-no-repeat"
            style={{ 
              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23EFE2BA'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e\")",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
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
          <h2 className="text-2xl font-bold text-[#F13C20] mb-6">{course.content.title}</h2>
          {course.content.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-[#4056A1] font-bold mb-2">{section.title}</h3>
              <p className="text-[#4056A1] whitespace-pre-line">{section.content}</p>
            </div>
          ))}
          
          {/* Mark as Read Button */}
          {!isTheoryRead && !progressLoading && (
            <button 
              onClick={markCurrentTheoryAsRead}
              className="mt-4 bg-[#4056A1] text-[#EFE2BA] px-4 py-2 rounded-lg hover:bg-[#2E3E7D] transition-colors"
            >
              Mark as Read
            </button>
          )}
          
          {isTheoryRead && (
            <div className="mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              ✓ You have completed this lesson
            </div>
          )}
        </div>

        {/* Right Column - Test or Project */}
        <div className="bg-[#C5CBE3] rounded-xl p-6">
          {selectedChapter === 'Chapter 1' && selectedLesson === 'Lesson 2' ? (
            <>
              <h2 className="text-2xl font-bold text-[#4056A1] mb-6">Case 2: Product Manager's Role in a Real Situation</h2>
              <div className="mb-4 text-[#4056A1]">
                <b>Task:</b>
                <br />
                Опишите реальную или вымышленную ситуацию, в которой продукт-менеджер должен принять важное решение для развития продукта.<br />
                <ul className="list-disc ml-6 mt-2">
                  <li>Опишите проблему, с которой столкнулся продукт-менеджер.</li>
                  <li>Какие шаги он предпринял для её решения?</li>
                  <li>Какой результат был достигнут?</li>
                </ul>
              </div>
              <form onSubmit={handleProjectSubmit}>
                <textarea
                  className="w-full min-h-[120px] p-3 rounded-lg border border-[#EFE2BA] mb-4 text-[#4056A1]"
                  placeholder="Введите ваш ответ здесь..."
                  value={projectText}
                  onChange={e => setProjectText(e.target.value)}
                  disabled={projectSubmitted}
                />
                <button
                  type="submit"
                  className="w-full bg-[#4056A1] text-[#EFE2BA] py-3 rounded-lg hover:bg-[#2E3E7D] transition-colors mb-4"
                  disabled={projectSubmitted || projectLoading || !projectText.trim()}
                >
                  {projectLoading ? 'Submitting...' : projectSubmitted ? 'Submitted' : 'Submit'}
                </button>
              </form>
              {projectFeedback && (
                <div className="bg-white rounded-lg p-4 mt-2">
                  <h3 className="font-bold text-[#F13C20] mb-2">Feedback from AI assistant</h3>
                  <div className="mb-2 text-[#4056A1] whitespace-pre-line">{projectFeedback.comment}</div>
                  <div className="font-bold text-[#4056A1]">Overall score: <span className="text-[#F13C20]">{projectFeedback.score}/10</span></div>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-[#4056A1] mb-6">{course.test.title}</h2>
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
                  disabled={testSubmitted}
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
            </>
          )}
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