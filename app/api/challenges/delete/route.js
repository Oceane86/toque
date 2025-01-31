// app/api/challenges/delete.route.js


import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { connectToDB } from "@mongodb/database";

// Configurer Cloudinary si nécessaire
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req) {
  const { photoUrl, challengeId } = await req.json(); 

  if (!photoUrl || !challengeId) {
    return NextResponse.json({ message: "Informations manquantes." }, { status: 400 });
  }

  try {
    // Connexion à la base de données
    const { db } = await connectToDB();

    // Supprimer la photo de la base de données
    const result = await db.collection("photos").deleteOne({ photoUrl, challengeId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Photo non trouvée dans la base de données." }, { status: 404 });
    }

    // Si la photo est stockée sur Cloudinary, supprimer la photo sur Cloudinary
    const publicId = photoUrl.split("/").pop().split(".")[0]; 
    await cloudinary.v2.uploader.destroy(publicId);

    return NextResponse.json({ message: "Photo supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la photo:", error);
    return NextResponse.json({ message: "Erreur lors de la suppression de la photo." }, { status: 500 });
  }
}
