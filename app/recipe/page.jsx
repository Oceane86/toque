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
  const [continent, setContinent] = useState("");
  const [generatedText, setGeneratedText] = useState([]); 
  const [imageUrls, setImageUrls] = useState([]);
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [imageLoading, setImageLoading] = useState(false);

  const handleGenerateText = async (uniquePrompt) => {
    setError("");
    setLoading(true); 
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
        return data.text;
      } else {
        setError(data.error || "Erreur lors de la génération du texte."); 
      }
    } catch (error) {
      setError("Une erreur s'est produite. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false); 
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

      setGeneratedText(recipes);
      setImageUrls(images);
      setImageLoading(false);
      setLoading(false);
    };

    generateRecipes(); 
  }, []); 

  const handleContinentChange = (e) => {
    const selectedContinent = e.target.value;
    setContinent(selectedContinent);
    
    // Si un continent est sélectionné, générez la recette liée au continent
    if (selectedContinent) {
      setLoading(true);
      setGeneratedText([])
      setImageUrls([]);

      const continentPrompt = `Génère une recette typique du continent ${selectedContinent}.`;

      // Générer la recette spécifique au continent
      handleGenerateText(continentPrompt).then((recipe) => {
        setGeneratedText((prevRecipes) => [...prevRecipes, recipe]);
        fetchImageForRecipe(recipe).then((imageUrl) => {
          setImageUrls((prevImages) => [...prevImages, imageUrl]); 
        });
        setLoading(false); 
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


      {error && <p style={{ color: "red" }}>{error}</p>} 
    </div>
  );
}
