// app/api/challenges/[id].js


import { ObjectId } from 'mongodb';  // Assure-toi d'utiliser ObjectId si tu compares l'ID de MongoDB

export async function GET(req, { params }) {
  const { id } = params;
  console.log('ID du challenge:', id);  // Log pour vérifier l'ID

  try {
    // Connexion à MongoDB et récupération du challenge
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('brekor');
    const challengesCollection = db.collection('challenges');

    // Recherche du challenge par son ID
    const challenge = await challengesCollection.findOne({ _id: new ObjectId(id) });

    if (!challenge) {
      return new Response(JSON.stringify({ message: 'Challenge non trouvé' }), { status: 404 });
    }

    return new Response(JSON.stringify({ challenge }), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération du challenge:', error);
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), { status: 500 });
  }
}
