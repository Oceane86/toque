// app/challenges/page.jsx


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  // Importation du hook useRouter pour la navigation
import { useSession } from "next-auth/react";  // Importation du hook useSession pour récupérer la session utilisateur

// Fonction pour récupérer une image de recette depuis Pexels
const fetchImageForRecipe = async (recipeName) => {
  const apiKey = process.env.PEXELS_API_KEY;  // Récupérer la clé API depuis .env
  const url = `https://api.pexels.com/v1/search?query=${recipeName}&per_page=1`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,  // Ajouter l'en-tête d'autorisation avec la clé API
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
  const regex = /Origine\s*:\s*([A-Za-z\s]+)/;  // Recherche du format "Origine : [nom du pays]"
  const match = recipeText.match(regex);
  return match ? match[1] : "Non spécifiée";  // Retourne le pays ou "Non spécifiée"
};

export default function ChallengesPage() {
  const { data: session, status } = useSession();  // Récupération de la session utilisateur
  const router = useRouter();  // Hook pour la navigation
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
        // Ajouter l'extraction du pays d'origine
        const origin = extractCountry(data.challenge.description);  // Extraire le pays d'origine
        return { ...data.challenge, origin };  // Ajouter l'origine à la recette
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
    return <div>Chargement...</div>;  // Affichage pendant le chargement de la session
  }

  if (!session?.user) {
    // Si l'utilisateur n'est pas connecté, on le redirige vers la page de login
    router.push("/login");  // Redirige vers la page de connexion
    return <div>Redirection vers la page de connexion...</div>;  // Affichage pendant la redirection
  }

  return (
    <div>
      <h1>Générateur de recettes avec Gemini</h1>
      {loading && <p>Génération des recettes...</p>}
      {generatedRecipes.length > 0 && (
        <div>
          <h2>Recettes générées :</h2>
          {generatedRecipes.map((recipe, index) => (
            <div key={index}>
              <h3>Recette {index + 1} :</h3>
              <p>{recipe.description}</p>
              <p><strong>Origine du pays :</strong> {recipe.origin || "Non spécifiée"}</p> {/* Affichage de l'origine */}
              {imageUrls[index] ? (
                <img src={imageUrls[index]} alt={`Image de ${recipe.description}`} style={{ maxWidth: "100%", height: "auto" }} />
              ) : (
                <p>Aucune image disponible pour cette recette.</p>
              )}
              {/* Bouton "Je participe" qui redirige vers la page de participation pour ce challenge spécifique */}
              <button 
                onClick={() => handleParticipate(recipe._id)} 
                style={{ padding: "10px 20px", marginTop: "20px", cursor: "pointer" }}
              >
                Je participe
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
