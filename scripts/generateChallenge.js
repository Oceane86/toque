// scripts/generateChallenge.js

import { post } from 'axios';

(async () => {
  try {
    console.log('Début de la génération de la recette de la semaine...');
    const response = await post('http://localhost:3000/api/challenges', {
      prompt: "Génère trois recettes traditionnelles venant de différents pays plus ou moins connus, adaptée à divers régimes alimentaires et indique le pays d'origine de la recette. Précise les régimes alimentaires et les allergènes. La recette doit rester avec les instructions, le temps de préparation la même pendant une semaine."
    });
    console.log('Nouvelle recette générée:', response.data);
  } catch (error) {
    console.error('Erreur lors de la génération de la recette:', error.message);
  }
})();