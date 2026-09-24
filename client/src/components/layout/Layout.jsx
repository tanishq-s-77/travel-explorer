import React from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100 selection:bg-skyvibe-200 selection:text-skyvibe-800">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
