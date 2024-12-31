// app/forum/page.jsx

'use client';

import React, { useState, useEffect } from 'react';
import Post from '@components/Post';
import CreatePost from '@components/CreatePost'; // Assurez-vous que ce composant existe

const Forum = () => {
  const [posts, setPosts] = useState([]);

  // Charger les posts depuis l'API au chargement de la page
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des posts :", error);
      }
    };
    fetchPosts();
  }, []);

  // Ajouter un post via l'API
  const addPost = async (title, content, media) => {
    const newPost = { title, content, media, userId: 'user_id_placeholder' }; // Assurez-vous d'avoir un userId valide

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du post');
      }

      const addedPost = await response.json();
      setPosts([addedPost, ...posts]); // Ajoutez le post ajouté à la liste des posts
    } catch (error) {
      console.error("Erreur lors de l'ajout du post :", error);
    }
  };

  return (
    <div className="app">
      <h1 className="header">Forum Reddit-like</h1>
      <CreatePost addPost={addPost} />
      <div className="post-list">
        {posts.map((post) => (
          <Post key={post._id} post={post} />  // Utilisez _id pour identifier les posts dans MongoDB
        ))}
      </div>
    </div>
  );
};

export default Forum;
