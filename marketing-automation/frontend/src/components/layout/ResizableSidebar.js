import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const ResizableSidebar = ({ navigation, onWidthChange }) => {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const isCompact = sidebarWidth <= 180;
  const isIconOnly = sidebarWidth <= 80;

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      if (newWidth >= 64 && newWidth <= 400) {
        setSidebarWidth(newWidth);
        onWidthChange?.(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, onWidthChange]);

  useEffect(() => {
    onWidthChange?.(sidebarWidth);
  }, []);

  const startResizing = () => {
    setIsResizing(true);
    document.body.style.cursor = 'ew-resize';
  };

  return (
    <div 
      ref={sidebarRef}
      className="fixed inset-y-0 left-0 bg-[#6366F1] flex z-20"
      style={{ width: sidebarWidth }}
    >
      <div className="flex flex-col h-full flex-grow overflow-hidden">
        {/* Logo */}
        <div className="flex items-center justify-center h-[64px] px-2 border-b border-white/10">
          <span className={`text-white font-semibold transition-all duration-200 ${
            isIconOnly ? 'text-sm' : isCompact ? 'text-base' : 'text-lg'
          }`}>
            {isIconOnly ? 'L' : isCompact ? 'LVL' : 'LVLHUB AI'}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              title={isIconOnly ? item.name : ''}
              className={`block py-2 px-3 mx-2 rounded-lg text-white/90 hover:bg-white/10 transition-colors ${
                location.pathname === item.path ? 'bg-white/20' : ''
              }`}
            >
              <div className={`flex items-center ${isIconOnly ? 'justify-center' : 'space-x-3'} overflow-hidden`}>
                <span className={`material-icons flex-shrink-0 transition-all duration-200 ${
                  isIconOnly ? 'text-base' : 'text-lg'
                } ${location.pathname === item.path ? 'text-white' : 'text-white/90'}`}>
                  {item.icon}
                </span>
                {!isIconOnly && (
                  <span className={`text-sm truncate transition-all duration-200 ${
                    isCompact ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                  }`}>
                    {item.name}
                  </span>
                )}
                {item.name === 'Campaigns' && !isIconOnly && (
                  <span className={`bg-white text-[#6366F1] rounded-full px-2 py-1 text-xs ml-auto flex-shrink-0 transition-all duration-200 ${
                    isCompact ? 'scale-75' : 'scale-100'
                  }`}>
                    3
                  </span>
                )}
              </div>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-white/10 p-4">
          <div className={`flex items-center ${isIconOnly ? 'justify-center' : 'space-x-3'} overflow-hidden`}>
            <div className="relative">
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className={`rounded-full transition-all duration-200 ring-2 ring-white/20 ${
                  isIconOnly ? 'w-6 h-6' : isCompact ? 'w-8 h-8' : 'w-10 h-10'
                }`}
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#6366F1]"></div>
            </div>
            {!isIconOnly && (
              <div className={`transition-all duration-200 ${
                isCompact ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              }`}>
                <p className="text-sm font-medium text-white truncate">Demo User</p>
                <p className="text-xs text-white/70 truncate">demo@example.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="w-1 cursor-ew-resize hover:bg-white/20 transition-colors"
        onMouseDown={startResizing}
      />
    </div>
  );
};

export default ResizableSidebar; 