// app/api/posts/route.js

import Post from "@models/Post";
import { connectToDB } from "@mongodb/database"; // Correction du nom de la fonction d'importation

// Fonction pour gérer la connexion à la DB
export async function GET() {
  await connectToDB(); // Utiliser la fonction connectToDB pour se connecter à la DB

  try {
    const posts = await Post.find();
    return new Response(JSON.stringify(posts), { status: 200 }); // Retourne tous les posts
  } catch (error) {
    console.error("Erreur lors de la récupération des posts", error);
    return new Response(
      JSON.stringify({
        message: "Erreur lors de la récupération des posts",
        error,
      }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectToDB(); // Utiliser la fonction connectToDB pour se connecter à la DB

  try {
    // Valider les données entrantes
    const { title, content, media, email } = await req.json();
    if (!email) {
      console.error("Données manquantes ou invalides");
      return new Response(
        JSON.stringify({
          error: "Les champs title, content, et email sont requis",
        }),
        { status: 400 }
      );
    }

    const newPost = new Post({ title, content, media, email });
    await newPost.save();
    return new Response(JSON.stringify(newPost), { status: 201 }); // Retourne le post créé
  } catch (error) {
    console.error("Erreur lors de la création du post", error);
    return new Response(
      JSON.stringify({ message: "Erreur lors de la création du post", error }),
      { status: 500 }
    );
  }
}
