// app/challenges/success/[id].js


import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ChallengeDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/challenges/${id}`)
        .then((res) => res.json())
        .then((data) => setChallenge(data))
        .catch((error) => console.error('Erreur de récupération du challenge:', error));
    }
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Logique de soumission de la réponse ici
    alert('Soumission réussie');
  };

  if (!challenge) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <h1>Défi {challenge.title}</h1>
      <p>{challenge.description}</p>
      <form onSubmit={handleSubmit}>
        <textarea placeholder="Votre réponse" required></textarea>
        <button type="submit">Soumettre</button>
      </form>
    </div>
  );
};

export default ChallengeDetail;
