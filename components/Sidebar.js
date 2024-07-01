import Image from 'next/image';
import React, { useState, useEffect } from 'react';

function Sidebar({ isOpen, toggleSidebar, onCreateBlogClick }) {
  const [showButtons, setShowButtons] = useState(true); // State to manage button visibility

  useEffect(() => {
    // Function to check current path and toggle button visibility
    const checkPath = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/signin' || currentPath === '/signup') {
        setShowButtons(false); // Hide buttons on sign-in and sign-up pages
      } else {
        setShowButtons(true); // Show buttons on other pages
      }
    };

    checkPath(); // Initial check on component mount

    // Event listener for popstate to handle route changes
    const handleRouteChange = () => {
      checkPath(); // Check path on route change
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []); // Empty dependency array ensures effect runs only on mount

  return (
    <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
      >
        X
      </button>
      <div className="p-4">
        <div className="flex items-center mb-8">
        </div>
        <nav className="flex flex-col">
          {/* Conditionally render Create Blog button */}
          {showButtons && (
            <button
              className='p-4 pb-4'
              onClick={() => {
                onCreateBlogClick();
                toggleSidebar();
              }}
            >
              <a href="#" className="mb-4 px-8 py-4 text-lg rounded-lg hover:bg-gray-700">
                Create Blog
              </a>
            </button>
          )}
          
          {/* Conditionally render Profile button */}
          {showButtons && (
            <button className='p-4 pb-4'>
              <a href="#" className="mb-4 px-8 py-4 text-lg rounded-lg hover:bg-gray-700">
                Profile
              </a>
            </button>
          )}
          
          {/* Conditionally render Settings button */}
          {showButtons && (
            <button className='p-4 pb-4'>
              <a href="#" className="mb-4 px-8 py-4 text-lg rounded-lg hover:bg-gray-700">
                Settings
              </a>
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
