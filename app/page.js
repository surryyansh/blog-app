"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState({});
  const [commentContent, setCommentContent] = useState({});
  const [showCommentBox, setShowCommentBox] = useState({});

  useEffect(() => {
    // Fetch the blogs from your API
    fetch('/api/blogs')
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          setBlogs(data);
        } else {
          setBlogs(getMockBlogs());
        }
      })
      .catch(error => {
        console.error('Error fetching blogs:', error);
        setBlogs(getMockBlogs());
      });
  }, []);

  const getMockBlogs = () => [
    {
      id: 1,
      title: "Mock Blog 1",
      content: "This is a mock blog content. It serves as a placeholder when no blogs are available.",
      mediaFiles: [],
      comments: [], // Add a comments array to each mock blog
    },
    {
      id: 2,
      title: "Mock Blog 2",
      content: "Here is another example of a mock blog. This can help you see how the page will look.",
      mediaFiles: [
        {
          url: "https://via.placeholder.com/150",
          type: "image/jpeg",
          name: "Placeholder Image",
        },
      ],
      comments: [], // Add a comments array to each mock blog
    },
  ];

  const handleCommentChange = (blogId, content) => {
    setCommentContent({
      ...commentContent,
      [blogId]: content
    });
  };

  const fetchComments = async (blogId) => {
    try {
      const response = await fetch(`/api/comments?blogId=${blogId}`);
      const data = await response.json();
      setComments(prevComments => ({
        ...prevComments,
        [blogId]: data
      }));
      // Ensure comment box is shown when comments are loaded
      setShowCommentBox(prevShow => ({
        ...prevShow,
        [blogId]: true
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (blogId) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          blogId,
          content: commentContent[blogId]
        })
      });

      const newComment = await response.json();
      setComments(prevComments => ({
        ...prevComments,
        [blogId]: [...(prevComments[blogId] || []), newComment]
      }));
      setCommentContent({
        ...commentContent,
        [blogId]: ''
      });
      // Show the comment box after submitting a comment
      setShowCommentBox(prevShow => ({
        ...prevShow,
        [blogId]: true
      }));
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const toggleCommentBox = (blogId) => {
    setShowCommentBox(prevShow => ({
      ...prevShow,
      [blogId]: !prevShow[blogId]
    }));
    // Fetch comments if they haven't been loaded yet
    if (!comments[blogId]) {
      fetchComments(blogId);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">

      </div>
      {blogs.length > 0 ? (
        blogs.map(blog => (
          <div key={blog.id} className="mb-8">
            <h2 className="text-2xl font-semibold">{blog.title}</h2>
            <p className="text-gray-600">{blog.content}</p>
            {blog.mediaFiles && blog.mediaFiles.map((file, index) => (
              <div key={index}>
                {file.type.startsWith('image/') && (
                  <img src={file.url} alt={file.name} className="mt-4" />
                )}
                {file.type.startsWith('video/') && (
                  <video src={file.url} controls className="mt-4" />
                )}
              </div>
            ))}
            <div className="mt-4">
              <button
                onClick={() => toggleCommentBox(blog.id)}
                className="text-blue-500"
              >
                {showCommentBox[blog.id] ? 'Hide Comments' : <Image src= "/comment.png" width={25} height={25}></Image>}
              </button>
              {showCommentBox[blog.id] && comments[blog.id] && comments[blog.id].map((comment, index) => (
                <p key={index} className="text-gray-600 mt-2">{comment.content}</p>
              ))}
              {showCommentBox[blog.id] && (
                <textarea
                  className="w-full h-20 p-2 border border-gray-300 rounded-lg resize-none bg-white mt-4"
                  placeholder="Add a comment..."
                  value={commentContent[blog.id] || ''}
                  onChange={(e) => handleCommentChange(blog.id, e.target.value)}
                ></textarea>
              )}
              {showCommentBox[blog.id] && (
                <button
                  onClick={() => handleCommentSubmit(blog.id)}
                  className="bg-blue-400 hover:bg-blue-600 text-white px-3 py-2 rounded-md mt-2"
                >
                  Comment
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No blogs published yet</p>
      )}
    </div>
  );
}
