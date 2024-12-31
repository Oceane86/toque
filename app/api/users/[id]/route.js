// app/api/users/[id]/route.js



import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Utilisez une variable d'environnement pour l'URI
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Connexion MongoDB partagée dans un environnement de développement
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // En mode développement, éviter d'ouvrir plusieurs connexions
  if (globalThis.mongoClientPromise) {
    clientPromise = globalThis.mongoClientPromise;
  } else {
    clientPromise = client.connect();
    globalThis.mongoClientPromise = clientPromise;
  }
} else {
  clientPromise = client.connect();
}

export async function POST(request) {
  const { title, content, media, userId } = await request.json();

  // Vérification si l'utilisateur est authentifié
  if (!userId) {
    return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 });
  }

  try {
    // Connexion à la base de données
    const client = await clientPromise;
    const db = client.db();
    const postsCollection = db.collection('posts');

    const newPost = {
      title,
      content,
      media,
      votes: 0,
      userId, // Associer le post avec l'utilisateur
      createdAt: new Date(),
    };

    const result = await postsCollection.insertOne(newPost);
    console.log('Post created:', result);

    return NextResponse.json({ id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du post' }, { status: 500 });
  }
}
