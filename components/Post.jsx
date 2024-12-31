// components/post.jsx

import React, { useState, useEffect } from 'react';

const Post = ({ post }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${post.userId}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de l\'utilisateur');
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };
  
    fetchUser();
  }, [post.userId]);
  

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="post">
      <h2 className="post-title">{post.title}</h2>
      <p className="post-content">{post.content}</p>
      {post.media && <img src={post.media} alt="Media" />}
      <div className="post-footer">
        <p>Posté par: {user.name}</p> {/* Afficher le nom de l'utilisateur */}
        <p>Votes: {post.votes}</p>
      </div>
    </div>
  );
};

export default Post;
