// app/api/challenges/[id]/photos/update/route.js

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

export async function PUT(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('photo');
    const photoId = formData.get('photoId');
    const challengeId = formData.get('challengeId');

    if (!file || !photoId || !challengeId) {
      return NextResponse.json({ message: "Des informations manquent." }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(challengeId)) {
      return NextResponse.json({ message: "ID de challenge invalide." }, { status: 400 });
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
      return NextResponse.json({ message: "Erreur lors de l'upload de l'image.", error: cloudinaryError.message }, { status: 500 });
    }

    try {
      await connectToDB();

      // Récupérer le challenge
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        return NextResponse.json({ message: 'Challenge non trouvé.' }, { status: 404 });
      }

      // Mise à jour de la photo dans le challenge
      const photoIndex = challenge.photos.findIndex(photo => photo._id.toString() === photoId);
      if (photoIndex === -1) {
        return NextResponse.json({ message: 'Photo non trouvée.' }, { status: 404 });
      }

      // Remplacer l'URL de la photo
      challenge.photos[photoIndex].url = result.secure_url;
      challenge.photos[photoIndex].date = new Date();  

      await challenge.save();

      return NextResponse.json({ message: 'Photo mise à jour avec succès.', photoUrl: result.secure_url }, { status: 200 });
    } catch (error) {
      console.error('MongoDB connection or update error:', error);
      return NextResponse.json({ message: "Erreur lors de la mise à jour de la photo.", error: error.message }, { status: 500 });
    }
  } catch (error) {
    console.error('Error during upload:', error);
    return NextResponse.json({ message: "Erreur lors de l'upload de l'image.", error: error.message }, { status: 500 });
  }
}
