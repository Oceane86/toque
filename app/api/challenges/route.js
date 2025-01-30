// app/api/challenges/route.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDB } from "@/mongodb/database";
import Challenge from "@/models/Challenge";
import User from "@/models/User";
import Post from "@/models/Post";

const weeklyPrompts = [
  // Semaine 1 : Recettes du monde entier, adaptées à divers régimes
  "Génère une recette traditionnelle provenant de différentes régions du monde, en tenant compte de plusieurs régimes alimentaires (végétarien, sans gluten, faible en sucre, etc.), avec des ingrédients détaillés, adaptés à des régimes spécifiques, mais également en mentionnant le pays d'origine du plat et des instructions claires.",
  
  // Semaine 2 : Recettes de plat principal typiques de pays différents
  "Génère une recette traditionnelle d'un plat principal typique de pays différents, incluant des ingrédients locaux et de saison, tout en offrant des options pour différents régimes alimentaires (végétalien, sans lactose, etc.).",
  
  // Semaine 3 : Recettes de desserts sucrés et salés inspirées de cultures variées
  "Propose une recette de dessert traditionnel sucré ou salé, inspirée de cultures variées, qui peut être adaptée aux régimes alimentaires comme le végétarisme, sans gluten, ou faible en sucre, avec des ingrédients détaillés et des instructions claires.",
  
  // Semaine 4 : Recettes végétariennes de diverses cultures
  "Génère une recette végétarienne traditionnelle provenant de diverses cultures du monde, avec des ingrédients de saison et adaptée à différents régimes alimentaires, comme sans produits laitiers, faible en calories, ou sans gluten.",
  
  // Semaine 5 : Recettes épicées inspirées des cuisines asiatiques
  "Génère une recette traditionnelle et épicée, inspirée de différentes cuisines asiatiques, en tenant compte des régimes alimentaires variés (sans produits laitiers, sans viande, etc.) et avec des instructions faciles à suivre.",
  
  // Semaine 6 : Recettes de plat principal venant de différents continents
  "Propose une recette traditionnelle de plat principal venant de différents continents, avec des options adaptées à des régimes spécifiques comme végétarien, sans gluten, ou faible en calories, tout en mettant en avant des ingrédients locaux et de saison."
];

function getWeeklyPrompt() {
  const currentWeek = Math.floor((new Date().getTime() / (1000 * 60 * 60 * 24 * 7)) % weeklyPrompts.length);
  return weeklyPrompts[currentWeek];
}

// Fonction pour extraire les ingrédients du texte de la recette
function extractIngredients(text) {
  const ingredientRegex = /\b(\d+\s?[a-zA-Z]+\s?[a-zA-Z]*\s?[a-zA-Z]*)\b/g;
  const ingredients = [];
  let match;
  while ((match = ingredientRegex.exec(text)) !== null) {
    ingredients.push(match[0]);
  }
  return ingredients;
}

// Fonction pour extraire les instructions du texte de la recette
function extractInstructions(text) {
  const instructionRegex = /(?:instructions|préparation)[\s\S]*?(\d+\. [\s\S]*?)(?=\d+\.)/gi;
  const instructions = [];
  let match;
  while ((match = instructionRegex.exec(text)) !== null) {
    instructions.push(match[1]);
  }
  return instructions.join(' '); 
}

// Fonction pour extraire le temps de préparation
function extractPreparationTime(text) {
  const timeRegex = /(?:préparation|temps de préparation)[\s\S]*?(\d+\s?[min|h|m]+)/gi;
  const match = timeRegex.exec(text);
  return match ? match[1] : 'Temps non spécifié';
}

// Fonction pour nettoyer le formatage markdown du texte
function cleanMarkdownFormatting(text) {
  // Enlève les titres (ex: ## Titre)
  text = text.replace(/##\s+/g, '');

  // Enlève les puces de listes (ex: * élément de liste)
  text = text.replace(/\*\s+/g, '');

  // Enlève d'autres éléments markdown si nécessaire (par exemple, les liens, italique, gras)
  text = text.replace(/\[.*?\]\(.*?\)/g, '');  // Retirer les liens
  text = text.replace(/\*\*.*?\*\*/g, '');     // Retirer le gras (bold)
  text = text.replace(/\*.*?\*/g, '');         // Retirer l'italique

  return text;
}

export async function POST(req) {
  const { prompt, userId } = await req.json(); 

  const finalPrompt = prompt || getWeeklyPrompt();

  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    // Génère la recette avec Gemini
    const result = await model.generateContent(finalPrompt);

    // Vérification de la réponse de Gemini
    if (!result || !result.response || typeof result.response.text !== 'function') {
      throw new Error('Réponse inattendue de l\'API Gemini');
    }

    let recipeText = result.response.text();

    // Assurez-vous que `recipeText` est bien une chaîne
    if (typeof recipeText !== 'string') {
      recipeText = JSON.stringify(recipeText); // Convertit en chaîne si nécessaire
    }

    // Nettoyer le texte avant de l'utiliser
    recipeText = cleanMarkdownFormatting(recipeText);

    // Image générique (à remplacer par l'URL d'une image générique)
    const genericImage = "../../../public/assets/cuisine.png";

    // Connexion à la base de données
    await connectToDB();

    // Calculer la date de fin (7 jours à partir de la date actuelle)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    // Enregistrement du challenge dans la collection Challenge
    const newChallenge = await Challenge.create({
      title: `Recette de la semaine: ${recipeText.split(' ')[0]}`,
      description: recipeText,
      origin: String,
      diet: String,
      ingredients: extractIngredients(recipeText),
      instructions: extractInstructions(recipeText),
      preparationTime: extractPreparationTime(recipeText),
      pexelsImages: [genericImage], // Utilisation de l'image générique
      createdBy: "Gemini",
      endDate: endDate,
    });

    // Ajout du challenge dans la collection User
    await User.findByIdAndUpdate(userId, {
      $push: { challenges: newChallenge._id },
      $push: { posts: newChallenge._id }
    });

    return new Response(
      JSON.stringify({ challenge: newChallenge }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur lors de la génération du texte avec Gemini:', error.message);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la génération du texte avec Gemini' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
