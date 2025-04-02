import CourseContent from './CourseContent';


export async function generateStaticParams() {
  
  const courseIds = [1, 2, 3];
  return courseIds.map((id) => ({
    id: id.toString(),
  }));
}

export default function CoursePage() {
  return <CourseContent />;
} 