import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

let blogs = [];

// Ensure the directory for storing uploaded files exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, since we are using formidable
  },
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Handle GET request: return the list of blogs
    res.status(200).json(blogs);
  } else if (req.method === 'POST') {
    // Handle POST request: add a new blog
    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filename: (name, ext, part, form) => `${uuidv4()}${ext}`,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to parse form data' });
        return;
      }

      const { title, content } = fields;
      const mediaFiles = [];

      if (files.mediaFiles) {
        if (Array.isArray(files.mediaFiles)) {
          files.mediaFiles.forEach(file => {
            mediaFiles.push({
              url: `/uploads/${path.basename(file.path)}`,
              type: file.type,
              name: file.name,
            });
          });
        } else {
          mediaFiles.push({
            url: `/uploads/${path.basename(files.mediaFiles.path)}`,
            type: files.mediaFiles.type,
            name: files.mediaFiles.name,
          });
        }
      }

      const newBlog = {
        id: uuidv4(),
        title,
        content,
        mediaFiles,
      };

      blogs.push(newBlog);
      res.status(201).json(newBlog);
    });
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
