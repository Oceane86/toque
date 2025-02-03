// app/api/challenges/route.js

import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDB } from "@/mongodb/database";
import Challenge from "@/models/Challenge";

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
"Propose une recette traditionnelle de plat principal venant de différents continents, avec des options adaptées à des régimes spécifiques comme végétarien, sans gluten, ou faible en calories, tout en mettant en avant des ingrédients locaux et de saison."];

function getWeeklyPrompt() {
  const currentWeek = Math.floor((new Date().getTime() / (1000 * 60 * 60 * 24 * 7)) % weeklyPrompts.length);
  return weeklyPrompts[currentWeek];
}

function cleanMarkdownFormatting(text) {
  return text.replace(/[*_~`]/g, '');
}

// Définition de la fonction pour extraire les ingrédients
function extractIngredients(text) {
  const lines = text.split('\n');
  return lines.filter(line => line.toLowerCase().includes('ingrédient'));
}

// Définition de la fonction pour extraire les instructions
function extractInstructions(text) {
  const lines = text.split('\n');
  const instructions = lines.filter(line => line.toLowerCase().includes('instruction'));
  return instructions.join('\n'); 
}
// Définition de la fonction pour extraire le temps de préparation
function extractPreparationTime(text) {
  const match = text.match(/\d+\s*minutes/);
  return match ? match[0] : 'Temps non spécifié';
}

export async function POST(req) {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    // Connexion à la base de données
    await connectToDB();

    const currentWeek = Math.floor((new Date().getTime() / (1000 * 60 * 60 * 24 * 7)) % weeklyPrompts.length);

    // Vérifier si un challenge existe déjà pour la semaine actuelle
    let existingChallenge = await Challenge.findOne({ week: currentWeek });

    if (existingChallenge) {
      return new Response(
        JSON.stringify({ challenge: existingChallenge }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const finalPrompt = getWeeklyPrompt();
    const result = await model.generateContent(finalPrompt);

    if (!result || !result.response || typeof result.response.text !== 'function') {
      throw new Error('Réponse inattendue de l\'API Gemini');
    }

    let recipeText = result.response.text();

    if (typeof recipeText !== 'string') {
      recipeText = JSON.stringify(recipeText);
    }

    recipeText = cleanMarkdownFormatting(recipeText);

    const genericImage = "../../../public/assets/cuisine.png";

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const newChallenge = await Challenge.create({
      title: `Recette de la semaine: ${recipeText.split(' ')[0]}`,
      description: recipeText,
      origin: String,
      diet: String,
      ingredients: extractIngredients(recipeText),
      instructions: extractInstructions(recipeText),
      preparationTime: extractPreparationTime(recipeText),
      pexelsImages: [genericImage],
      createdBy: "Gemini",
      endDate: endDate,
      week: currentWeek
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
