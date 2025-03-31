"use client"; // Если у вас компонент на стороне клиента

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
  
}