// app/api/challenges/share-photo/route.js

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

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('photo');
    const challengeId = formData.get('challengeId');

    if (!file) {
      return NextResponse.json({ message: "Aucun fichier n'a été fourni." }, { status: 400 });
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
      return NextResponse.json({ message: "Erreur lors de l'upload de l'image sur Cloudinary.", error: cloudinaryError.message }, { status: 500 });
    }

    try {
      await connectToDB();

      const photoUrl = result.secure_url;
      console.log('Updating Challenge with photo URL...');
      const updateResult = await Challenge.updateOne(
        { _id: challengeId },
        { $push: { photos: { url: photoUrl, date: new Date() } } }
      );

      if (updateResult.nModified === 0) {
        return NextResponse.json({ message: "Aucun challenge mis à jour. Vérifiez l'ID." }, { status: 404 });
      }

      return NextResponse.json({ photoUrl: photoUrl, message: 'Photo téléchargée avec succès.' }, { status: 200 });
    } catch (error) {
      console.error('MongoDB connection or update error:', error);
      return NextResponse.json({ message: "Erreur lors de l'upload de l'image.", error: error.message }, { status: 500 });
    }
  } catch (error) {
    console.error('Error during upload:', error);
    return NextResponse.json({ message: "Erreur lors de l'upload de l'image.", error: error.message }, { status: 500 });
  }
}
