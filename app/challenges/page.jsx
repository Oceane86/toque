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
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateText = async (uniquePrompt) => {
    setError("");
    setLoading(true);
    try {
      const prompt =
        uniquePrompt ||
        "Génère une recette de cuisine traditionnelle variée avec des ingrédients détaillés, en ajoutant le nom du pays d'origine du plat et des instructions claires.";
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (response.ok) {
        // Extraction de l'origine et du régime alimentaire
        const origin = extractCountry(data.challenge.description);
        const diet = data.challenge.diet || "Non spécifié"; // Fallback si le régime n'est pas défini

        return { ...data.challenge, origin, diet };
      } else {
        setError(data.error || "Erreur lors de la génération du texte.");
        return null;
      }
    } catch (error) {
      setError("Une erreur s'est produite. Veuillez réessayer plus tard.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const generateRecipes = async () => {
      setLoading(true);
      const prompts = [
        "Génère une recette traditionnelle venant de différents pays, adaptée à divers régimes alimentaires et indique le pays d'origine de la recette.",
        "Propose une recette innovante, végétarienne et épicée.",
        "Génère une recette traditionnelle sucrée avec des fruits de saison.",
      ];

      const recipes = await Promise.all(
        prompts.map((prompt) => handleGenerateText(prompt))
      );

      // Filtrer les recettes valides (au cas où il y aurait des erreurs)
      const validRecipes = recipes.filter(Boolean);

      setGeneratedRecipes(validRecipes);
      setLoading(false);
    };
    generateRecipes();
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
      <h1 className={styles.title}>Générateur de recettes avec Gemini</h1>
      {loading && <p>Génération des recettes...</p>}
      {generatedRecipes.length > 0 && (
        <div className={styles.recipesList}>
          {/* <h2 className={styles.subtitle}>Recettes générées :</h2> */}
          {generatedRecipes.map((recipe, index) => (
            <div key={recipe._id} className={styles.recipeCard}>
              <h3 className={styles.recipeTitle}>Recette {index + 1} :</h3>
              <p className={styles.recipeDescription}>
                <strong>Nom de la recette : </strong>
                {recipe.description.split("\n")[0]}
              </p>

              {/* Utilisation d'une image locale par défaut */}
              <img
                src="/assets/cuisine.png"
                alt={`Image de ${recipe.description}`}
                className={styles.recipeImage}
              />

              <button
                onClick={() => handleParticipate(recipe._id)}
                className={styles.participateButton}
              >
                Je participe
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
      <Footer />
    </div>
  );
}
