// app/api/challenges/[id]/route.js

import { connectToDB } from '@mongodb/database';
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return new Response('ID invalide', { status: 400 });
  }

  try {
    const db = await connectToDB();

    if (!db) {
      return new Response('Erreur de connexion à la base de données', { status: 500 });
    }

    const challenge = await db.collection('challenges').findOne({ _id: new ObjectId(id) });

    if (!challenge) {
      return new Response('Challenge introuvable', { status: 404 });
    }

    return new Response(JSON.stringify(challenge), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération du challenge:', error);
    return new Response('Erreur serveur', { status: 500 });
  }
}
