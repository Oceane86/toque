// app/culinary/page.jsx

"use client";
import { useEffect, useState } from 'react';
import Navbar from '@components/NavBar';
import styles from './culinary.module.css'; 
import Footer from '@components/Footer';
import Loader from '@components/Loader';
import '../../styles/globals.css';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedContinent, setSelectedContinent] = useState('Tous');
  const [currentPage, setCurrentPage] = useState(1); 
  const [recipesPerPage] = useState(6);  
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/culinary');
        const data = await response.json();

        if (response.ok) {
          setRecipes(data);
        } else {
          setError(data.error || 'Erreur lors de la récupération des recettes');
        }
      } catch (error) {
        setError('Erreur de réseau');
      } finally {
        setLoading(false); 
      }
    };

    fetchRecipes();
  }, []);

  const handleContinentChange = (event) => {
    setSelectedContinent(event.target.value);
    setCurrentPage(1);
  };

  const filteredRecipes = selectedContinent === 'Tous'
    ? recipes
    : recipes.filter(recipe => recipe.continent === selectedContinent);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (error) {
    return <div className={styles.error}>{`Erreur: ${error}`}</div>;
  }

  if (loading) {
    return <Loader />; 
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <h2 className={styles.title}>Recettes :</h2>

      {/* Sélecteur de continent */}
      <div className={styles.filterContainer}>
        <label htmlFor="continent-select" className={styles.filterLabel}>Sélectionnez un continent :</label>
        <select id="continent-select" onChange={handleContinentChange} className={styles.filterSelect}>
          <option value="Tous">Tous</option>
          <option value="Amérique">Amérique</option>
          <option value="Europe">Europe</option>
          <option value="Afrique">Afrique</option>
          <option value="Asie">Asie</option>
          <option value="Océanie">Océanie</option>
        </select>
      </div>

      <div className={styles.recipeGrid}>
        {currentRecipes.map((recipe, index) => (
          <div key={index} className={styles.recipeCard}>
            <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
            <div className={styles.recipeContent}>
              <h3 className={styles.recipeTitle}>{recipe.title}</h3>
              <p className={styles.recipeSummary}>{recipe.summary}</p>
              <div className={styles.recipeDetails}>
                <p>{recipe.isVegan ? 'Vegan' : 'Non Vegan'}</p>
                <p>{recipe.isVegetarian ? 'Végétarien' : 'Non Végétarien'}</p>
                {Array.isArray(recipe.cuisines) && recipe.cuisines.length > 0 && (
                  <p>{`Cuisines : ${recipe.cuisines.join(', ')}`}</p>
                )}
                {recipe.diets && recipe.diets.length > 0 && <p>{`Régimes : ${recipe.diets.join(', ')}`}</p>}
                {recipe.readyInMinutes && <p>{`Temps de préparation : ${recipe.readyInMinutes} minutes`}</p>}
                {recipe.healthScore != null && <p>{`Score santé : ${recipe.healthScore}`}</p>}
                {recipe.sourceUrl && <p><a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.recipeLink}>Source de la recette</a></p>}
                {recipe.glutenFree != null && <p>{recipe.glutenFree ? 'Sans gluten' : 'Contient du gluten'}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button 
          onClick={handlePrevPage} 
          className={styles.paginationButton} 
          disabled={currentPage === 1}
        >
          &lt; Précédent
        </button>
        <span className={styles.pageNumber}>{`Page ${currentPage} / ${totalPages}`}</span>
        <button 
          onClick={handleNextPage} 
          className={styles.paginationButton} 
          disabled={currentPage === totalPages}
        >
          Suivant &gt;
        </button>
      </div>

      <Footer />
    </div>
  );
}
