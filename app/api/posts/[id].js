// app/api/posts/[id].js


import dbConnect from '../../../lib/mongodb';
import Post from '../../../models/Post';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ error: 'Post non trouvé' });
      }
      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la récupération du post' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { content, author } = req.body;

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ error: 'Post non trouvé' });
      }

      post.replies.push({ content, author, createdAt: new Date() });
      await post.save();

      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de l\'ajout de la réponse' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
