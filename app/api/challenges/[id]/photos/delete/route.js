// app/api/challenges/[id]/photos/delete/route.js
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { connectToDB } from '@mongodb/database';
import Challenge from '@models/Challenge';
import mongoose from 'mongoose';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req, { params }) {
  const { photoId, id: challengeId } = params; // Récupérer photoId et challengeId dans les paramètres

  if (!photoId || !challengeId) {
    return NextResponse.json({ message: "Des informations manquent." }, { status: 400 });
  }

  if (!mongoose.Types.ObjectId.isValid(challengeId)) {
    return NextResponse.json({ message: "ID de challenge invalide." }, { status: 400 });
  }

  try {
    await connectToDB();

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return NextResponse.json({ message: 'Challenge non trouvé.' }, { status: 404 });
    }

    const photoIndex = challenge.photos.findIndex(photo => photo._id.toString() === photoId);
    if (photoIndex === -1) {
      return NextResponse.json({ message: 'Photo non trouvée.' }, { status: 404 });
    }

    // Supprimer l'image de Cloudinary
    const cloudinaryPublicId = challenge.photos[photoIndex].url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(cloudinaryPublicId);

    // Supprimer la photo de la collection
    challenge.photos.splice(photoIndex, 1);
    await challenge.save();

    return NextResponse.json({ message: 'Photo supprimée avec succès.' }, { status: 200 });
  } catch (error) {
    console.error('Error during deletion:', error);
    return NextResponse.json({ message: "Erreur lors de la suppression de la photo.", error: error.message }, { status: 500 });
  }
}
