// app/api/users/challenges/route.js

import User from "@models/User";
import Challenge from "@models/Challenge";
import { connectToDB } from "@/mongodb/database"; // Assurez-vous que le connecteur MongoDB est correct

export async function POST(req) {
  try {
    console.log('Requête POST reçue'); // Ajouter un log pour suivre les requêtes

    // Connexion à la base de données
    await connectToDB();

    // Récupérer les données de la requête
    const { email, challengeId } = await req.json();
    console.log('Données reçues:', { email, challengeId }); // Log les données

    // Vérification des paramètres requis
    if (!email || !challengeId) {
      console.log('Paramètres manquants');
      return new Response(
        JSON.stringify({ message: "Email and challengeId are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Recherche de l'utilisateur
    const user = await User.findOne({ email });

    if (!user) {
      console.log('Utilisateur non trouvé');
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Vérifier l'existence du challenge
    const challengeExists = await Challenge.findById(challengeId);
    if (!challengeExists) {
      console.log('Challenge non trouvé');
      return new Response(
        JSON.stringify({ message: "Challenge not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Ajouter le challenge à l'utilisateur s'il n'existe pas déjà
    if (!user.challenges.includes(challengeId)) {
      user.challenges.push(challengeId);
      await user.save();
      console.log('Challenge ajouté à l\'utilisateur');
    }

    // Réponse en cas de succès
    return new Response(
      JSON.stringify({ message: "Challenge added to user", user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Erreur lors de l\'ajout du challenge:', error.message); // Log des erreurs
    return new Response(
      JSON.stringify({ message: "Error adding challenge", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
