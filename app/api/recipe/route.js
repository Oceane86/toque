// app/api/recipe/route.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Liste de prompts prédéfinis pour éviter les répétitions
const defaultPrompts = [
  "Génère une recette traditionnelle ou bien connue et variée avec des ingrédients détaillés et des instructions claires, et indique l'origine du pays de la recette.",
  "Génère une recette de cuisine végétarienne avec des ingrédients locaux et de saison, en mentionnant le pays d'origine.",
  "Génère une recette typique d'un plat principal avec des protéines et des légumes, en précisant l'origine du pays.",
  "Génère une recette de dessert sucré avec des fruits de saison, en ajoutant l'origine du pays.",
  "Génère une recette épicée et savoureuse avec des influences asiatiques et indique le pays d'origine.",
  "Génère une recette traditionnelle d'un continent différent, et mentionne l'origine du pays.",
];

const extractCountry = (recipeText) => {
  const regex = /Origine\s*:\s*([A-Za-z\s]+)/;  // Recherche du format "Origine : [nom du pays]"
  const match = recipeText.match(regex);
  return match ? match[1] : "Non spécifiée";  // Retourne le pays ou "Non spécifiée"
};

export async function POST(req) {
  // Récupère le prompt de la requête
  const { prompt } = await req.json();

  // Vérifie si le prompt est vide et choisit un prompt par défaut
  const finalPrompt = prompt || defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)];

  // Clé API Gemini depuis les variables d'environnement
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  // Sélectionne le modèle à utiliser
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    // Génère le contenu en fonction du prompt
    const result = await model.generateContent(finalPrompt);
    const generatedText = result.response.text();

    // Extraire l'origine du pays de la réponse générée
    const origin = extractCountry(generatedText);

    // Retourne le texte généré avec l'origine du pays
    return new Response(
      JSON.stringify({ text: generatedText, origin }),  // Ajout de l'origine dans la réponse
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur API Gemini:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la génération du texte avec Gemini' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
