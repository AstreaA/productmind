import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'ProductMind',
  description: 'Learn Product Management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#EFE2BA] font-sans">
        <div className="p-8">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}