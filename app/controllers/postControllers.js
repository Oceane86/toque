const Post = require('../models/Post');

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id; // Assurez-vous que l'utilisateur est authentifié
    let media = null;

    // Si un média est téléchargé, récupérez l'URL
    if (req.file) {
      media = req.file.path;
    }

    const newPost = new Post({
      title,
      content,
      media,
      userId,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { createPost };
