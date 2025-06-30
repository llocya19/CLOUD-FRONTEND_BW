import React, { useState } from 'react';
import Navbar from './Navbar';
import { Sidebar } from './Sidebar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#8b8b86]">
      <Navbar onToggleMenu={() => setMenuOpen(true)} />
      <Sidebar show={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="pt-[130px] px-4 max-w-screen-xl mx-auto">
        {children}
      </div>
    </div>
  );
};
