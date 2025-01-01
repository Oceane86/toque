// app/api/challenges/success/[id].js

"use client";

import { useEffect, useState } from "react";

export default function SuccessPage({ params }) {
  const { id } = params; // Récupère l'ID du challenge depuis l'URL
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(`/api/challenges/${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données du challenge.");
        }
        const data = await response.json();
        setChallenge(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (id) {
      fetchChallenge();
    }
  }, [id]);

  if (!challenge) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Succès !</h1>
      <h2>{challenge.title}</h2>
      <p>{challenge.description}</p>
      <p>Date de fin : {new Date(challenge.endDate).toLocaleDateString()}</p>
    </div>
  );
}
