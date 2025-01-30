// app/api/challenges/[id]/photos/route.js

import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { connectToDB } from '@mongodb/database';
import Challenge from '@models/Challenge';
import Post from '@models/Post';
import mongoose from 'mongoose';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = 'nodejs';

// Gestion de la méthode POST pour télécharger et partager une photo
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('photo');
    const challengeId = formData.get('challengeId');
    const userId = formData.get('userId'); // Assurez-vous que l'ID de l'utilisateur est fourni.

    if (!file) {
      return NextResponse.json({ message: "Aucun fichier n'a été fourni." }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(challengeId)) {
      return NextResponse.json({ message: "ID de challenge invalide." }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "ID d'utilisateur invalide." }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64File = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64File}`;

    let result;
    try {
      console.log('Uploading image to Cloudinary...');
      result = await cloudinary.uploader.upload(dataUri, { folder: 'uploads' });
      console.log('Image successfully uploaded to Cloudinary:', result);
    } catch (cloudinaryError) {
      console.error('Error uploading to Cloudinary:', cloudinaryError);
      return NextResponse.json({ message: "Erreur lors de l'upload de l'image sur Cloudinary.", error: cloudinaryError.message }, { status: 500 });
    }

    try {
      await connectToDB();

      const photoUrl = result.secure_url;
      console.log('Creating post with photo URL...');

      // Créer un post pour associer la photo au challenge
      const newPost = new Post({
        title: "Photo partagée", // Titre par défaut, ou tu peux le personnaliser
        content: "Voici une photo partagée dans le challenge.", // Contenu par défaut
        author: userId, // ID de l'utilisateur qui partage la photo
        photoUrl: photoUrl,
        challengeId: challengeId, // ID du challenge auquel la photo est associée
      });

      await newPost.save();

      // Ajouter l'URL de la photo dans le challenge
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        return NextResponse.json({ message: 'Challenge non trouvé.' }, { status: 404 });
      }

      // Ajouter la photo au challenge sous forme d'objet
      challenge.photos.push({
        url: photoUrl,  // URL de la photo
        date: new Date(), // Date actuelle de l'ajout de la photo
        uploadedBy: userId, // ID de l'utilisateur qui a téléchargé la photo
      });

      await challenge.save();

      return NextResponse.json({ photoUrl: photoUrl, message: 'Photo téléchargée et partagée avec succès.' }, { status: 200 });
    } catch (error) {
      console.error('MongoDB connection or post creation error:', error);
      return NextResponse.json({ message: "Erreur lors de l'upload de l'image.", error: error.message }, { status: 500 });
    }
  } catch (error) {
    console.error('Error during upload:', error);
    return NextResponse.json({ message: "Erreur lors de l'upload de l'image.", error: error.message }, { status: 500 });
  }
}

// Gestion de la méthode GET pour récupérer les photos du challenge
export async function GET(req, { params }) {
  const { id } = params; // id du challenge à récupérer les photos

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID de challenge invalide." }, { status: 400 });
    }

    // Connexion à la base de données
    await connectToDB();

    // Recherche du challenge par son ID
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return NextResponse.json({ message: "Challenge non trouvé." }, { status: 404 });
    }

    // Récupérer les photos du challenge
    return NextResponse.json({ photos: challenge.photos }, { status: 200 });
  } catch (error) {
    console.error('Error during GET request:', error);
    return NextResponse.json({ message: "Erreur lors de la récupération des photos.", error: error.message }, { status: 500 });
  }
}
