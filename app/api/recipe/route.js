// app/api/recipe/route.js


import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  const { prompt } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Liste de prompts variés pour éviter les répétitions
  const defaultPrompts = [
    "Génère une recette traditionnelle ou bien connus et variés avec des ingrédients détaillés et des instructions claires.",
    "Génère une recette de cuisine végétarienne avec des ingrédients locaux et de saison.",
    "Génère une recette typique d'un plat principal avec des protéines et des légumes.",
    "Génère une recette de dessert sucré avec des fruits de saison.",
    "Génère une recette épicée et savoureuse avec des influences asiatiques.",

  ];

  // Choisir un prompt aléatoire parmi ceux proposés
  const randomPrompt = defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)];

  const finalPrompt = prompt || randomPrompt; // Utilise le prompt personnalisé ou aléatoire

  try {
    const result = await model.generateContent(finalPrompt);
    return new Response(
      JSON.stringify({ text: result.response.text() }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erreur API Gemini:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la génération du texte avec Gemini' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
