import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  nav: React.ReactNode;
}

export const Layout = ({ children, nav }: LayoutProps) => {
  return (
    <div className="h-screen w-full bg-white text-black font-sans flex flex-col overflow-hidden">
        <header className="flex-none w-full">
          {nav}
        </header>

        <main className="flex-1 w-full pb-12 overflow-hidden px-4 md:px-8">
          {children}
        </main>
        
      </div>

  );
};