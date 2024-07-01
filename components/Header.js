"use client";
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import React, { useState } from 'react';
import Sidebar from './Sidebar';

function Header({ onBlogPublished }) {
  const [showTextBox, setShowTextBox] = useState(false);
  const [blogContent, setBlogContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false); // New state to manage publishing state

  const handleCloseButtonClick = () => {
    setShowTextBox(false);
  };

  const handleAddMediaClick = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles([...mediaFiles, ...files]);
  };

  const handleRemoveMedia = (index) => {
    const updatedMediaFiles = [...mediaFiles];
    updatedMediaFiles.splice(index, 1);
    setMediaFiles(updatedMediaFiles);
  };

  const handlePublishClick = () => {
    if (isPublishing) return; // Prevent multiple publish attempts

    setIsPublishing(true);
    const formData = new FormData();
    formData.append('title', 'New Blog');
    formData.append('content', blogContent);
    mediaFiles.forEach((file, index) => {
      formData.append(`mediaFiles[${index}]`, file);
    });

    fetch('/api/blogs', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Blog published:', data);
        onBlogPublished(data);
        setBlogContent('');
        setMediaFiles([]);
        setShowTextBox(false);
        alert('Blog published successfully!');
        setIsPublishing(false);
      })
      .catch(error => {
        console.error('Error publishing blog:', error);
        alert('Error publishing blog. Please try again.');
        setIsPublishing(false);
      });
  };

  const handleChange = (e) => {
    setBlogContent(e.target.value);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCreateBlogClick = () => {
    setShowTextBox(true);
    setIsSidebarOpen(false);
  };

  return (
    <div className="relative">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onCreateBlogClick={handleCreateBlogClick} />
      <div className="font-serif font-normal flex items-center justify-between p-4 pb-2 pl-4 text-2xl border-b-[4px] border-gray-200 bg-white">
        <button
          onClick={toggleSidebar}
          className="flex items-center focus:outline-none p-0.5 pb-0.5 border-[3px] rounded-2xl bg-gray-200 w-fit hover:bg-gray-300 transition-colors duration-300"
        >
          <Image src="/menu.png" alt="Menu" width={25} height={25} />
        </button>
        <div className="flex items-center">Blogs-Up</div>
        <div className="text-right pr-3">
          <UserButton />
        </div>
      </div>

      {showTextBox && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-90 flex justify-center items-center z-50">
          <div className="relative p-4 border border-gray-300 bg-white text-black rounded-lg w-3/4 max-w-3xl">
            <button
              onClick={handleCloseButtonClick}
              className="absolute top-2 right-2 rounded-full w-8 h-8 flex items-center justify-center bg-gray-300 text-black"
            >
              X
            </button>
            <textarea
              className="w-full h-96 p-2 border border-gray-300 rounded-lg resize-none bg-white text-black"
              style={{ minHeight: '20rem' }}
              placeholder="Type your blog here..."
              value={blogContent}
              onChange={handleChange}
            ></textarea>
            <div className="mt-2 flex flex-col space-y-2">
              <input
                type="file"
                multiple
                onChange={handleAddMediaClick}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                onClick={handlePublishClick}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                {isPublishing ? 'Publishing...' : 'Publish Blog'}
              </button>
            </div>
            <div className="mt-4">
              {mediaFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {file.type.startsWith('image/') && (
                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-16 h-16 object-cover rounded" />
                  )}
                  {file.type.startsWith('video/') && (
                    <video src={URL.createObjectURL(file)} className="w-16 h-16 object-cover rounded" controls />
                  )}
                  <span>{file.name}</span>
                  <button
                    onClick={() => handleRemoveMedia(index)}
                    className="text-red-500 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
