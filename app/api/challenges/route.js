// api/challenges/route.js

import mongoose from "mongoose";
import User from "@/models/User";  // Assurez-vous d'importer User
import Challenge from "@/models/Challenge";  // Assurez-vous d'importer Challenge
import { NextResponse } from "next/server";

// Fonction de connexion à la base de données
const connectToDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log("Déjà connecté à la base de données");
      return;  // Si déjà connecté, on ne refait pas la connexion
    }

    console.log("Connexion à la base de données...");
    await mongoose.connect(process.env.MONGODB_URI);  // Assurez-vous que l'URI est correcte
    console.log("Connecté à MongoDB");
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error);
    throw new Error("Échec de la connexion à MongoDB");
  }
};

// Route PATCH pour participer à un défi
export const PATCH = async (req) => {
  console.log("Tentative de connexion à la base de données...");

  try {
    await connectToDB();  // Vérifier la connexion à la DB
    console.log("Connexion réussie à la base de données");

    const { challengeId, userId } = await req.json();
    console.log(`Données reçues - challengeId: ${challengeId}, userId: ${userId}`);

    const user = await User.findById(userId);  // Trouver l'utilisateur
    const challenge = await Challenge.findById(challengeId);  // Trouver le défi

    if (!challenge) {
      console.log("Défi non trouvé");
      return NextResponse.json({ error: "Défi non trouvé." }, { status: 404 });
    }

    if (!user) {
      console.log("Utilisateur non trouvé");
      return NextResponse.json({ error: "Utilisateur non trouvé." }, { status: 404 });
    }

    console.log("Utilisateur et défi trouvés");

    // Vérifier si l'utilisateur est déjà inscrit
    if (!challenge.participants.includes(userId)) {
      // Ajouter l'utilisateur au défi (en utilisant addToSet pour éviter les doublons)
      challenge.participants.addToSet(userId);
      await challenge.save();

      // Ajouter le défi dans les participations de l'utilisateur
      user.participations.addToSet(challengeId);
      await user.save();

      console.log("Participation enregistrée");

      return NextResponse.json({ success: true, message: "Participation enregistrée." }, { status: 200 });
    } else {
      console.log("Utilisateur déjà inscrit au défi");
      return NextResponse.json({ error: "Utilisateur déjà inscrit au défi." }, { status: 400 });
    }
  } catch (error) {
    console.error("Erreur lors de la participation au défi:", error);
    return NextResponse.json({ error: "Erreur lors de la participation au défi." }, { status: 500 });
  }
};

// Route POST pour créer un défi
export const POST = async (req) => {
  console.log("Tentative de connexion à la base de données...");

  try {
    await connectToDB();  // Vérifier la connexion à la DB
    console.log("Connexion réussie à la base de données");

    const { title, description, image, deadline } = await req.json(); // Récupérer les données du défi à partir du body de la requête

    // Créer un nouveau défi
    const newChallenge = new Challenge({
      title,
      description,
      image,
      deadline,
      participants: [], // Initialiser la liste des participants comme vide
    });

    await newChallenge.save(); // Sauvegarder le défi dans la base de données

    console.log("Défi créé avec succès");

    return NextResponse.json(newChallenge, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du défi:", error);
    return NextResponse.json({ error: "Erreur lors de la création du défi." }, { status: 500 });
  }
};
