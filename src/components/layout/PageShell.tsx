import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface PageShellProps {
  children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F3ED] text-[#172522] print:h-auto print:w-auto print:overflow-visible print:bg-white print:block">
      {/* 1. Left Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden print:h-auto print:w-full print:overflow-visible print:block">
        {/* Top Navigation Bar */}
        <TopBar />

        {/* Page Body Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#F5F3ED] flex flex-col print:h-auto print:w-full print:overflow-visible print:bg-white print:p-0 print:block">
          {children}
        </main>
      </div>
    </div>
  );
};
