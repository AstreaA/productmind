import CourseContent from './CourseContent';

// Define which course IDs should be pre-rendered at build time
export async function generateStaticParams() {
  // This would typically come from an API or database
  const courseIds = [1, 2, 3];
  return courseIds.map((id) => ({
    id: id.toString(),
  }));
}

export default function CoursePage() {
  return <CourseContent />;
} 