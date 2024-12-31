import React, { useState } from 'react';

const CreatePost = ({ addPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && content) {
      addPost(title, content, media);
      setTitle('');
      setContent('');
      setMedia('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Contenu"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="URL du média (facultatif)"
        value={media}
        onChange={(e) => setMedia(e.target.value)}
      />
      <button type="submit">Ajouter le post</button>
    </form>
  );
};

export default CreatePost;
