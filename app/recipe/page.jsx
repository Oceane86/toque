// app/recipe/page.jsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@components/NavBar";
import styles from "./../challenges/challenges.module.css";
import Footer from "@components/Footer";

// Fonction pour récupérer une image de recette depuis l'API Stable Diffusion (via Replicate)
const fetchImageForRecipe = async (recipeName) => {
  const apiKey = process.env.NEXT_PUBLIC_REPLICATE_API_KEY; // Utilisation de NEXT_PUBLIC pour les variables d'environnement côté client
  const url = "https://api.replicate.com/v1/predictions";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "stability-ai/stable-diffusion-2",
        input: {
          prompt: `A delicious and visually appealing image of ${recipeName} dish`,
          num_inference_steps: 50,
        },
      }),
    });

    const data = await response.json();
    if (data?.output?.length > 0) {
      return data.output[0];
    } else {
      console.error("Aucune image générée :", data);
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
  return match ? match[1].trim() : "Non spécifiée";
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

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la génération du texte.");
      }

      const data = await response.json();
      const origin = extractCountry(data.challenge.description);
      return { ...data.challenge, origin };
    } catch (error) {
      setError(error.message || "Une erreur s'est produite.");
      return null;
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

      const recipes = await Promise.all(prompts.map((prompt) => handleGenerateText(prompt)));
      const validRecipes = recipes.filter(Boolean);
      setGeneratedRecipes(validRecipes);

      // Récupérer les images pour chaque recette
      const images = await Promise.all(
        validRecipes.map((recipe) => fetchImageForRecipe(recipe.title))
      );
      setImageUrls(images);

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

  if (!session?.user) {
    router.push("/login");
    return <div>Redirection vers la page de connexion...</div>;
  }

  return (
    <div>
      <Navbar />
      <h1>Recettes Générées</h1>
      {loading ? (
        <div>Chargement des recettes...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.recipeList}>
          {generatedRecipes.map((recipe, index) => (
            <div key={index} className={styles.recipeCard}>
              <h3>{recipe.title}</h3>
              {imageUrls[index] ? (
                <img src={imageUrls[index]} alt={recipe.title} className={styles.recipeImage} />
              ) : (
                <p>Aucune image disponible.</p>
              )}
              <p>
                <strong>Origine :</strong> {recipe.origin}
              </p>
              <p>
                <strong>Ingrédients :</strong> {recipe.ingredients.join(", ")}
              </p>
              <p>
                <strong>Instructions :</strong> {recipe.instructions}
              </p>
              <button onClick={() => handleParticipate(recipe._id)}>Participer</button>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}
