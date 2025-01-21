// app/api/check-username.route.js

import { connectToDB } from "@/lib/mongodb"; 

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { username } = req.query;

    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Le nom d'utilisateur est requis." });
    }

    try {
      const { db } = await connectToDB();
      const user = await db.collection("users").findOne({ username });

      if (user) {
        return res.status(409).json({ message: "Le nom d'utilisateur est déjà pris." });
      }

      return res.status(200).json({ message: "Nom d'utilisateur disponible." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur interne du serveur." });
    }
  } else {
    return res.status(405).json({ message: "Méthode non autorisée." });
  }
}
