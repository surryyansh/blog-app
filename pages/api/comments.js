let blogs = [
    {
      id: 1,
      title: "Mock Blog 1",
      content: "This is a mock blog content. It serves as a placeholder when no blogs are available.",
      mediaFiles: [],
      comments: [], // Add comments array to mock blog
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
      comments: [], // Add comments array to mock blog
    },
  ]; // Ensure this is shared across API routes or use a proper database
  
  export default function handler(req, res) {
    if (req.method === 'GET') {
      // Fetch comments for a specific blog post
      const { blogId } = req.query;
      const blog = blogs.find(blog => blog.id === parseInt(blogId));
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      res.status(200).json(blog.comments);
    } else if (req.method === 'POST') {
      // Add a new comment
      const { blogId, content } = req.body;
      const blog = blogs.find(blog => blog.id === parseInt(blogId));
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      const newComment = { id: Date.now(), content };
      blog.comments.push(newComment);
      res.status(201).json(newComment);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  