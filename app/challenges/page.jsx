// app/challenges/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  
import { useSession } from "next-auth/react"; 
import Navbar from '@components/NavBar';
import styles from "./challenges.module.css";  
import Footer from "@components/Footer";

// Fonction pour récupérer une image de recette depuis Pexels
const fetchImageForRecipe = async (recipeName) => {
  const apiKey = process.env.PEXELS_API_KEY;  // Récupérer la clé API depuis .env
  const url = `https://api.pexels.com/v1/search?query=${recipeName}&per_page=1`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,  
      },
    });

    const data = await response.json();
    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.small;  // Retourne l'URL de la petite image
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'image :", error);
    return null;
  }
};

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
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateText = async (uniquePrompt) => {
    setError("");
    setLoading(true);
    try {
      const prompt = uniquePrompt || "Génère une recette de cuisine traditionnelle variée avec des ingrédients détaillés, en ajoutant le nom du pays d'origine du plat et des instructions claires.";
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (response.ok) {
        const origin = extractCountry(data.challenge.description);  
        return { ...data.challenge, origin };  
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
        "Génère une recette traditionnelle sucrée avec des fruits de saison."
      ];

      const recipes = await Promise.all(prompts.map((prompt) => handleGenerateText(prompt)));
      
      // Filtrer les recettes valides (au cas où il y aurait des erreurs)
      const validRecipes = recipes.filter(Boolean);

      setGeneratedRecipes(validRecipes);

      // Récupérer les images pour les recettes générées
      const images = await Promise.all(validRecipes.map((recipe) => fetchImageForRecipe(recipe.description)));
      setImageUrls(images);

      setLoading(false);
    };
    generateRecipes();
  }, []);

  const handleParticipate = (challengeId) => {
    // Naviguer vers la page de participation en incluant l'ID du challenge
    router.push(`/challenges/${challengeId}`);
  };

  if (status === "loading") {
    return <div>Chargement...</div>;  
  }

  if (!session?.user) {
    router.push("/login"); 
    return <div>Redirection vers la page de connexion...</div>; 
  }

  return (
    <div>
      <Navbar />
      <h1 className={styles.title}>Générateur de recettes avec Gemini</h1> 
      {loading && <p>Génération des recettes...</p>}
      {generatedRecipes.length > 0 && (
        <div className={styles.recipesList}>
          <h2>Recettes générées :</h2>
          {generatedRecipes.map((recipe, index) => (
            <div key={index} className={styles.recipeCard}>
              <h3>Recette {index + 1} :</h3>
              <p className={styles.recipeDescription}>
                {recipe.description.split('\n').map((line, index) => {
                  if (line.startsWith('Ingrédients:')) {
                    return (
                      <div key={index}>
                        <strong>Ingrédients:</strong>
                        <ul>
                          {line.split(',').map((ingredient, idx) => (
                            <li key={idx}>{ingredient.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  } else if (line.startsWith('Instructions:')) {
                    return (
                      <div key={index}>
                        <strong>Instructions:</strong>
                        <ol>
                          {line.split('.').map((step, idx) => (
                            <li key={idx}>{step.trim()}</li>
                          ))}
                        </ol>
                      </div>
                    );
                  } else {
                    return <p key={index}>{line}</p>;
                  }
                })}
              </p>
              {imageUrls[index] ? (
                <img src={imageUrls[index]} alt={`Image de ${recipe.description}`} className={styles.recipeImage} />
              ) : (
                <p>Aucune image disponible pour cette recette.</p>
              )}
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
      <Footer/>
    </div>
  );
}
