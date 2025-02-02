// app/api/culinary/route.js

import { NextResponse } from 'next/server';
import fs from 'fs'; 
import path from 'path'; 

export async function GET(req) {
  try {
    // Lire le fichier JSON localement
    const filePath = path.join(process.cwd(), 'public', 'data', 'recipes.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const recipes = JSON.parse(fileData); 

    if (recipes && recipes.length > 0) {
      // Retourne les recettes sous forme de JSON
      return NextResponse.json(recipes);
    } else {
      return NextResponse.json({ error: 'Aucune recette trouvée' }, { status: 500 });
    }
  } catch (error) {
    console.error('Erreur lors de la lecture des recettes depuis le fichier', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des recettes' }, { status: 500 });
  }
}
