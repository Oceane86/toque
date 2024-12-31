// app/api/challenges/participation/[email].route.js
import { MongoClient } from "mongodb";

// Fonction pour connecter à la base de données
const connectToDB = async () => {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  return client.db();
};

// Méthode GET pour récupérer les participations par email
export async function GET(_req, { params }) {
  const { email } = params;
  console.log("Email capturé :", email); // Ajoutez un log pour vérifier

  if (!email) {
    return new Response(JSON.stringify({ error: "Email manquant dans l'URL" }), {
      status: 400,
    });
  }

  const db = await connectToDB();

  try {
    // Récupère les participations associées à l'email
    const participations = await db.collection('participations').find({ email }).toArray();

    if (participations.length === 0) {
      return new Response(JSON.stringify({ message: "Aucune participation trouvée." }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ participations }), { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des participations : ", error);
    return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), {
      status: 500,
    });
  }
}
