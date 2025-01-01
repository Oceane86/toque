// app/posts/[id].js

import { useRouter } from 'next/router';

const PostDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Post {id}</h1>
      <div>
        <h2>Réponses</h2>
        <ul>
          <li>Réponse 1</li>
          <li>Réponse 2</li>
          <li>Réponse 3</li>
        </ul>
      </div>
    </div>
  );
};

export default PostDetail;
