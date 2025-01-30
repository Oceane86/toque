// app/api/challenges/[id]/add-photo/route.js

import { NextResponse } from 'next/server';
import { connectToDB } from '@mongodb/database';

export async function POST(req) {
  try {
    const { photoUrl } = await req.json();
    const { id } = req.query; // Récupérer l'ID du challenge

    const { db } = await connectToDB(); // Connexion à la DB

    const result = await db.collection('posts').updateOne(
      { _id: id },
      { $push: { photos: { url: photoUrl, date: new Date() } } }
    );

    if (!result.modifiedCount) {
      return NextResponse.json(
        { message: 'Échec de l\'ajout de la photo dans la base de données.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Photo ajoutée avec succès' }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la photo:', error);
    return NextResponse.json(
      { message: "Erreur lors de l'ajout de la photo." },
      { status: 500 }
    );
  }
}
