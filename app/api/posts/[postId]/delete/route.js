// pages/api/posts/[postId]/delete/route.js

import { NextResponse } from "next/server";
import { connectToDB } from "@mongodb/database";
import { ObjectId } from "mongodb";
import Post from "@models/Post";

export async function DELETE(req, { params }) {
    const { postId } = params;
    console.log('ID du post à supprimer:', postId); // Log pour vérifier l'ID

    try {
        await connectToDB(); // Connexion à la base de données

        // Suppression du post avec l'ID donné
        const result = await Post.deleteOne({ _id: new ObjectId(postId) });

        // Vérification si un document a été supprimé
        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "Post non trouvé." }, { status: 404 });
        }

        return NextResponse.json({ message: "Post supprimé avec succès." }, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la suppression du post:", error);
        return NextResponse.json({ error: error.message || "Erreur interne du serveur." }, { status: 500 });
    }
}

export function OPTIONS() {
  return createCorsResponse(new NextResponse(null, { status: 204 }));
}

function createCorsResponse(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}