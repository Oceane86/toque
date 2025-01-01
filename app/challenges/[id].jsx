// app/challenges/[id].jsx

import { useRouter } from 'next/router';

export default function Challenge() {
  const router = useRouter();
  const { id } = router.query; // Capture l'ID du challenge depuis l'URL

  if (!id) {
    return <div>Loading...</div>; // Affiche un message de chargement tant que l'ID n'est pas disponible
  }

  return (
    <div>
      <h1>Détails du challenge {id}</h1>
      {/* Affiche les détails du challenge ici */}
    </div>
  );
}
