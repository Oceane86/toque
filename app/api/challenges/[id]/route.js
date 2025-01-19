// app/api/challenges/[id]/route.js
import { connectToDB } from '@mongodb/database'; // Assurez-vous que votre fonction de connexion est correcte
import { ObjectId } from 'mongodb';

// Fonction pour la méthode GET pour récupérer un challenge
export async function GET(req, { params }) {
  const { id } = params; // Récupère l'ID du challenge à partir de l'URL
  
  // Vérifier si l'ID est valide
  if (!ObjectId.isValid(id)) {
    return new Response('ID invalide', { status: 400 });
  }

  try {
    // Connexion à la base de données MongoDB
    const db = await connectToDB();

    // Vérifier si la connexion à la base de données est réussie
    if (!db) {
      return new Response('Erreur de connexion à la base de données', { status: 500 });
    }

    // Vérifier que la collection 'challenges' existe
    const challenge = await db.collection('challenges').findOne({ _id: new ObjectId(id) });

    if (!challenge) {
      return new Response('Challenge introuvable', { status: 404 });
    }

    // Si le challenge est trouvé, renvoyer les données
    return new Response(JSON.stringify(challenge), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération du challenge:', error);
    return new Response('Erreur serveur', { status: 500 });
  }
}
