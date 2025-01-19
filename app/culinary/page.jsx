// app/culinary/page.jsx



"use client";
import { useEffect, useState } from 'react';
import Navbar from '@components/NavBar';
import '../../styles/globals.css';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/culinary');
        const data = await response.json();

        if (response.ok) {
          setRecipes(data); // Mettre à jour les recettes avec les données récupérées
        } else {
          setError(data.error || 'Erreur lors de la récupération des recettes');
        }
      } catch (error) {
        setError('Erreur de réseau');
      }
    };

    fetchRecipes();
  }, []);

  if (error) {
    return <div>{`Erreur: ${error}`}</div>;
  }

  if (recipes.length === 0) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <Navbar />
      
      <h2>Recettes :</h2>
      {recipes.map((recipe, index) => (
        <div key={index}>
          <h3>{recipe.title}</h3>
          <p>{recipe.summary}</p>
          <img src={recipe.image} alt={recipe.title} style={{ width: "100%", maxWidth: "400px" }} />
          
          {/* Affichage des informations supplémentaires */}
          <p>{recipe.isVegan ? 'Vegan' : 'Non Vegan'}</p>
          <p>{recipe.isVegetarian ? 'Végétarien' : 'Non Végétarien'}</p>

          {/* Affichage conditionnel des cuisines */}
          {Array.isArray(recipe.cuisines) && recipe.cuisines.length > 0 && (
            <p>{`Cuisines : ${recipe.cuisines.join(', ')}`}</p>
          )}

          {/* Affichage des régimes alimentaires */}
          {recipe.diets && recipe.diets.length > 0 && <p>{`Régimes : ${recipe.diets.join(', ')}`}</p>}

          {/* Affichage du temps de préparation */}
          {recipe.readyInMinutes && <p>{`Temps de préparation : ${recipe.readyInMinutes} minutes`}</p>}

          {/* Affichage du score santé */}
          {recipe.healthScore != null && <p>{`Score santé : ${recipe.healthScore}`}</p>}

          {/* Affichage de l'URL de la source */}
          {recipe.sourceUrl && <p><a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">Source de la recette</a></p>}

          {/* Affichage du gluten */}
          {recipe.glutenFree != null && <p>{recipe.glutenFree ? 'Sans gluten' : 'Contient du gluten'}</p>}
        </div>
      ))}
    </div>
  );
}
