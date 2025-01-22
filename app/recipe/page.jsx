// app/recipe/page.jsx

"use client";

import { useState, useEffect } from "react";

// Fonction pour obtenir une image de plat via l'API Unsplash
const fetchImageForRecipe = async (recipeName) => {
  const accessKey = "JOuNEAttntEEr_VVGNLnM6lwqvAs8m9ENDO1Og7rQQk"; // Remplacez par votre clé API Unsplash
  const url = `https://api.unsplash.com/search/photos?query=${recipeName}&client_id=${accessKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.small; // Retourner l'URL de la première image trouvée
    } else {
      return null; // Si aucune image n'est trouvée
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'image :", error);
    return null;
  }
};

export default function RecipePage() {
  const [continent, setContinent] = useState(""); // État pour le continent sélectionné
  const [generatedText, setGeneratedText] = useState([]); // Stocker les recettes générées
  const [imageUrls, setImageUrls] = useState([]); // Stocker les URL des images
  const [error, setError] = useState(""); // État pour gérer les erreurs
  const [loading, setLoading] = useState(false); // État pour gérer l'indicateur de chargement
  const [imageLoading, setImageLoading] = useState(false); // Indicateur de chargement des images

  const handleGenerateText = async (uniquePrompt) => {
    setError(""); // Réinitialiser l'erreur
    setLoading(true); // Démarrer le chargement
    try {
      const prompt = uniquePrompt
        ? uniquePrompt
        : "Génère une recette de cuisine traditionnelle variée avec des ingrédients détaillés et des instructions claires.";

      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (response.ok) {
        return data.text; // Retourner la recette générée
      } else {
        setError(data.error || "Erreur lors de la génération du texte."); // Gestion de l'erreur
      }
    } catch (error) {
      setError("Une erreur s'est produite. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  // Utilisation d'un effet pour générer des recettes dès le chargement de la page
  useEffect(() => {
    const generateRecipes = async () => {
      setLoading(true);
      setImageLoading(true);

      // Prompts variés pour générer plusieurs recettes différentes
      const prompts = [
        "Génère une recette traditionnelle avec des ingrédients locaux.",
        "Propose une recette innovante avec des ingrédients du monde entier.",
        "Crée une recette simple mais savoureuse pour un dîner rapide.",
        "Génère une recette pour un plat végétarien avec des ingrédients courants."
      ];

      // Générer plusieurs recettes à partir des prompts différents
      const recipes = await Promise.all(prompts.map(prompt => handleGenerateText(prompt)));

      // Récupérer les images pour chaque recette
      const imagePromises = recipes.map((recipe) => fetchImageForRecipe(recipe));
      const images = await Promise.all(imagePromises);

      setGeneratedText(recipes); // Mettre à jour avec les recettes générées
      setImageUrls(images); // Mettre à jour avec les URL des images
      setImageLoading(false); // Fin du chargement des images
      setLoading(false); // Fin du chargement des recettes
    };

    generateRecipes(); // Appeler la fonction pour générer les recettes automatiquement
  }, []); // Le tableau vide fait en sorte que cela s'exécute une seule fois au montage de la page

  const handleContinentChange = (e) => {
    const selectedContinent = e.target.value;
    setContinent(selectedContinent);
    
    // Si un continent est sélectionné, générez la recette liée au continent
    if (selectedContinent) {
      setLoading(true);
      setGeneratedText([]); // Réinitialiser les recettes générées
      setImageUrls([]); // Réinitialiser les images

      const continentPrompt = `Génère une recette typique du continent ${selectedContinent}.`;

      // Générer la recette spécifique au continent
      handleGenerateText(continentPrompt).then((recipe) => {
        setGeneratedText((prevRecipes) => [...prevRecipes, recipe]); // Ajouter la recette du continent à la liste
        fetchImageForRecipe(recipe).then((imageUrl) => {
          setImageUrls((prevImages) => [...prevImages, imageUrl]); // Ajouter l'image à la liste
        });
        setLoading(false); // Fin du chargement
      });
    }
  };

  return (
    <div>
      <h1>Générateur de recette avec Gemini</h1>

      {loading && <p>Génération des recettes...</p>}
      {generatedText.length > 0 && (
        <div>
          <h2>Recettes générées :</h2>
          {generatedText.map((recipe, index) => (
            <div key={index}>
              <h3>Recette {index + 1} :</h3>
              <p>{recipe}</p>
              {imageLoading ? (
                <p>Chargement de l'image...</p>
              ) : imageUrls[index] ? (
                <img src={imageUrls[index]} alt={`Image de ${recipe}`} style={{ width: "100%", maxWidth: "400px" }} />
              ) : (
                <img src="/images/default-image.jpg" alt="Image générique" style={{ width: "100%", maxWidth: "400px" }} />
              )}
            </div>
          ))}
        </div>
      )}


      {error && <p style={{ color: "red" }}>{error}</p>} {/* Affiche l'erreur si elle existe */}
    </div>
  );
}
