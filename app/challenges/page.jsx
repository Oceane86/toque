// app/challenges/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@components/NavBar";
import styles from "./challenges.module.css";
import Footer from "@components/Footer";

// Fonction pour extraire l'origine du pays
const extractCountry = (recipeText) => {
  const regex = /Origine\s*:\s*([A-Za-z\s]+)/;
  const match = recipeText.match(regex);
  return match ? match[1] : "Non spécifiée";
};

export default function ChallengesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [weeklyRecipe, setWeeklyRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeeklyRecipe = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/challenges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          // Extraction de l'origine et du régime alimentaire
          const origin = extractCountry(data.challenge.description);
          const diet = data.challenge.diet || "Non spécifié"; 

          setWeeklyRecipe({ ...data.challenge, origin, diet });
        } else {
          setError(data.error || "Erreur lors de la récupération de la recette.");
        }
      } catch (error) {
        setError("Une erreur s'est produite. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyRecipe();
  }, []);

  const handleParticipate = (challengeId) => {
    router.push(`/challenges/${challengeId}`);
  };

  if (status === "loading") {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <Navbar />
      <h1 className={styles.title}>Recette de la semaine avec Gemini</h1>
      <p className={styles.motivationalText}>
        Découvrez une recette unique qui vous fera voyager à travers les saveurs du monde. Ce challenge culinaire est l'occasion parfaite pour explorer de nouvelles cuisines et partager vos créations avec notre communauté passionnée. Relevez le défi et montrez vos talents culinaires !
      </p>
      {loading && <p>Chargement de la recette...</p>}
      {weeklyRecipe && (
        <div className={styles.recipeCard}>
          <h3 className={styles.recipeTitle}>Recette de la semaine :</h3>
          <p className={styles.recipeDescription}>
            <strong>Nom de la recette : </strong>
            {weeklyRecipe.description.split("\n")[0]}
          </p>

          {/* Utilisation d'une image par défaut */}
          <img
            src="/assets/cuisine.png"
            alt={`Image de ${weeklyRecipe.description}`}
            className={styles.recipeImage}
          />

          <button
            onClick={() => handleParticipate(weeklyRecipe._id)}
            className={styles.participateButton}
          >
            Je participe
          </button>
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}

      {/* Nouveau texte pour indiquer la disponibilité de la prochaine recette */}
      <p className={styles.nextRecipeText}>
        Une nouvelle recette sera disponible la semaine prochaine, restez à l'écoute pour plus de délices culinaires !
      </p>

      <Footer />
    </div>
  );
}