// app/api/check-email/route.js
import { connectToDB } from "@/mongodb/database";

const isValidDomain = (email) => {
  const regex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const domain = email.split('@')[1];
  return regex.test(domain); 
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { email } = req.query;

    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "L'adresse email est requise." });
    }

    // Validation du domaine de l'email avec regex
    if (!isValidDomain(email)) {
      return res.status(400).json({ message: "Domaine d'email invalide." });
    }

    try {
      const { db } = await connectToDB();
      const user = await db.collection("users").findOne({ email });

      if (user) {
        return res.status(409).json({ message: "L'adresse email est déjà utilisée." });
      }

      return res.status(200).json({ message: "Email disponible." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur interne du serveur." });
    }
  } else {
    return res.status(405).json({ message: "Méthode non autorisée." });
  }
}
