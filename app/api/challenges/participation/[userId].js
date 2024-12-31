// app/api/challenges/participation/[userId].js
import { MongoClient, ObjectId } from "mongodb";

// Fonction pour connecter à la base de données
const connectToDB = async () => {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  return client.db();
};

// Méthode GET pour récupérer les participations de l'utilisateur
export async function GET(req, { params }) {
  const { userId } = params; // Récupérer l'ID de l'utilisateur depuis les paramètres

  if (!userId) {
    return new Response(JSON.stringify({ error: 'ID utilisateur manquant' }), { status: 400 });
  }

  const db = await connectToDB();

  try {
    // Récupérer l'utilisateur et ses participations
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Utilisateur non trouvé' }), { status: 404 });
    }

    // Récupérer les informations des défis
    const participationsWithChallenge = await Promise.all(
      user.challengeIds.map(async (challengeId) => {
        const challenge = await db.collection('challenges').findOne({ _id: new ObjectId(challengeId) });
        return {
          challengeId,
          challengeTitle: challenge ? challenge.title : "Défi introuvable",
        };
      })
    );

    return new Response(JSON.stringify({ participations: participationsWithChallenge }), { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des participations :", error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la récupération des participations' }), { status: 500 });
  }
}
