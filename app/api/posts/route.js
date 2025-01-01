// app/api/posts/route.js
import { connectToDB } from "@/mongodb/database";
import Post from '../../../models/Post';

export default async function handler(req, res) {
  await connectToDB(); 
  if (req.method === 'POST') {
    try {
      const { title, content, author } = req.body;

      const newPost = new Post({
        title,
        content,
        author,
        createdAt: new Date(),
      });

      const savedPost = await newPost.save();
      return res.status(201).json(savedPost);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la création du post' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
