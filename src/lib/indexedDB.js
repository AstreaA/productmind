'use client';

// IndexedDB configuration and helper functions
import bcrypt from 'bcryptjs';

const DB_NAME = 'productMindDB';
const DB_VERSION = 3;
const USER_STORE = 'users';
const COURSES_STORE = 'courses';
const THEORY_STORE = 'theory';
const EXERCISES_STORE = 'exercises';

// Initialize the database
export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject('Error opening database: ' + event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create the users object store if it doesn't exist
      if (!db.objectStoreNames.contains(USER_STORE)) {
        const userStore = db.createObjectStore(USER_STORE, { keyPath: 'id', autoIncrement: true });
        
        // Create indexes for fast lookups
        userStore.createIndex('email', 'email', { unique: true });
        userStore.createIndex('name', 'name', { unique: false });
        
        console.log('Users store created');
      }
      
      // Create the courses object store if it doesn't exist
      if (!db.objectStoreNames.contains(COURSES_STORE)) {
        const coursesStore = db.createObjectStore(COURSES_STORE, { keyPath: 'id', autoIncrement: true });
        
        // Create indexes for fast lookups
        coursesStore.createIndex('user_id', 'user_id', { unique: false });
        coursesStore.createIndex('course_id', 'course_id', { unique: false });
        coursesStore.createIndex('user_course', ['user_id', 'course_id'], { unique: true });
        
        console.log('Courses store created');
      }
      
      // Create the theory object store if it doesn't exist
      if (!db.objectStoreNames.contains(THEORY_STORE)) {
        const theoryStore = db.createObjectStore(THEORY_STORE, { keyPath: 'id', autoIncrement: true });
        
        // Create indexes for fast lookups
        theoryStore.createIndex('course_id', 'course_id', { unique: false });
        theoryStore.createIndex('user_id', 'user_id', { unique: false });
        theoryStore.createIndex('user_course', ['user_id', 'course_id'], { unique: false });
        
        console.log('Theory store created');
      }
      
      // Create the exercises object store if it doesn't exist
      if (!db.objectStoreNames.contains(EXERCISES_STORE)) {
        const exercisesStore = db.createObjectStore(EXERCISES_STORE, { keyPath: 'id', autoIncrement: true });
        
        // Create indexes for fast lookups
        exercisesStore.createIndex('course_id', 'course_id', { unique: false });
        exercisesStore.createIndex('user_id', 'user_id', { unique: false });
        exercisesStore.createIndex('user_course', ['user_id', 'course_id'], { unique: false });
        
        console.log('Exercises store created');
      }
    };
  });
}

// Register a new user
export async function registerUser(name, email, password) {
  const db = await initDB();
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const created_at = new Date().toISOString();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USER_STORE], 'readwrite');
    const userStore = transaction.objectStore(USER_STORE);
    
    // Check if user already exists
    const emailIndex = userStore.index('email');
    const emailCheck = emailIndex.get(email);
    
    emailCheck.onsuccess = (event) => {
      if (event.target.result) {
        reject('User with this email already exists');
        return;
      }
      
      // Add new user
      const request = userStore.add({
        name,
        email,
        password: hashedPassword,
        created_at
      });
      
      request.onsuccess = (event) => {
        // Return the user without the password
        resolve({
          id: event.target.result,
          name,
          email,
          created_at
        });
      };
      
      request.onerror = (event) => {
        reject('Error registering user: ' + event.target.error);
      };
    };
    
    emailCheck.onerror = (event) => {
      reject('Error checking email: ' + event.target.error);
    };
  });
}

// Login a user
export async function loginUser(email, password) {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USER_STORE], 'readonly');
    const userStore = transaction.objectStore(USER_STORE);
    const emailIndex = userStore.index('email');
    
    const request = emailIndex.get(email);
    
    request.onsuccess = async (event) => {
      const user = event.target.result;
      
      if (!user) {
        reject('Invalid credentials');
        return;
      }
      
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        reject('Invalid credentials');
        return;
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      resolve(userWithoutPassword);
    };
    
    request.onerror = (event) => {
      reject('Error during login: ' + event.target.error);
    };
  });
}

// Start a course for a user
export async function startCourse(userId, courseId) {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([COURSES_STORE], 'readwrite');
    const coursesStore = transaction.objectStore(COURSES_STORE);
    const index = coursesStore.index('user_course');
    
    const checkRequest = index.get([userId, courseId]);
    
    checkRequest.onsuccess = (event) => {
      // If course already started, just return it
      if (event.target.result) {
        resolve(event.target.result);
        return;
      }
      
      // Add new course entry
      const request = coursesStore.add({
        user_id: userId,
        course_id: courseId,
        started_at: new Date().toISOString(),
        courses_started: true
      });
      
      request.onsuccess = (event) => {
        resolve({
          id: event.target.result,
          user_id: userId,
          course_id: courseId,
          courses_started: true
        });
      };
      
      request.onerror = (event) => {
        reject('Error starting course: ' + event.target.error);
      };
    };
    
    checkRequest.onerror = (event) => {
      reject('Error checking course: ' + event.target.error);
    };
  });
}

// Mark theory as read
export async function markTheoryAsRead(userId, courseId, chapterId) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([THEORY_STORE], 'readwrite');
    const theoryStore = transaction.objectStore(THEORY_STORE);
    // Add new theory entry
    const request = theoryStore.add({
      user_id: userId,
      course_id: courseId,
      chapter_id: chapterId,
      theory_read: true,
      read_at: new Date().toISOString()
    });
    request.onsuccess = (event) => {
      resolve({
        id: event.target.result,
        user_id: userId,
        course_id: courseId,
        chapter_id: chapterId,
        theory_read: true
      });
    };
    request.onerror = (event) => {
      reject('Error marking theory as read: ' + event.target.error);
    };
  });
}

// Mark exercise as completed
export async function markExerciseAsCompleted(userId, courseId, exerciseId) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EXERCISES_STORE], 'readwrite');
    const exercisesStore = transaction.objectStore(EXERCISES_STORE);
    // Add new exercise entry
    const request = exercisesStore.add({
      user_id: userId,
      course_id: courseId,
      exercise_id: exerciseId,
      exercises_completed: true,
      completed_at: new Date().toISOString()
    });
    request.onsuccess = (event) => {
      resolve({
        id: event.target.result,
        user_id: userId,
        course_id: courseId,
        exercise_id: exerciseId,
        exercises_completed: true
      });
    };
    request.onerror = (event) => {
      reject('Error marking exercise as completed: ' + event.target.error);
    };
  });
}

// Get all started courses for a user
export async function getUserCourses(userId) {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([COURSES_STORE], 'readonly');
    const coursesStore = transaction.objectStore(COURSES_STORE);
    const index = coursesStore.index('user_id');
    
    const request = index.getAll(userId);
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      reject('Error getting user courses: ' + event.target.error);
    };
  });
}

// Get all read theory chapters for a course and user
export async function getCourseTheory(userId, courseId) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([THEORY_STORE], 'readonly');
    const theoryStore = transaction.objectStore(THEORY_STORE);
    const index = theoryStore.index('user_course');
    const request = index.getAll([userId, courseId]);
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      reject('Error getting course theory: ' + event.target.error);
    };
  });
}

// Get all completed exercises for a course and user
export async function getCourseExercises(userId, courseId) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EXERCISES_STORE], 'readonly');
    const exercisesStore = transaction.objectStore(EXERCISES_STORE);
    const index = exercisesStore.index('user_course');
    const request = index.getAll([userId, courseId]);
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      reject('Error getting course exercises: ' + event.target.error);
    };
  });
}

// Get user progress for all courses
export async function getUserProgress(userId) {
  try {
    // Get all started courses
    const courses = await getUserCourses(userId);
    if (courses.length === 0) {
      return { hasStartedCourses: false, courses: [] };
    }
    // For each course, get theory and exercises
    const progressPromises = courses.map(async (course) => {
      const theory = await getCourseTheory(userId, course.id);
      const exercises = await getCourseExercises(userId, course.id);
      return {
        course_id: course.course_id,
        theories_read: theory.length,
        exercises_completed: exercises.length
      };
    });
    const progress = await Promise.all(progressPromises);
    return {
      hasStartedCourses: true,
      courses: progress
    };
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(id) {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USER_STORE], 'readonly');
    const userStore = transaction.objectStore(USER_STORE);
    
    const request = userStore.get(id);
    
    request.onsuccess = (event) => {
      const user = event.target.result;
      
      if (!user) {
        reject('User not found');
        return;
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      resolve(userWithoutPassword);
    };
    
    request.onerror = (event) => {
      reject('Error getting user: ' + event.target.error);
    };
  });
} 