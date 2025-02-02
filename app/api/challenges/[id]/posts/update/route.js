// app/api/challenges/[id]/posts/update/route.js

import { connectToDB } from "@mongodb/database";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import User from "@models/User";


export async function PUT(req) {
    const urlParts = req.url.split('/');
    const postIdIndex = urlParts.indexOf('posts') + 1;
    const postId = urlParts[postIdIndex];

    if (!postId) {
        return new Response(JSON.stringify({ error: "ID du post manquant." }), { status: 400 });
    }

    const session = await getServerSession(req, authOptions);
    if (!session || !session.user) {
        return new Response(JSON.stringify({ error: "Non autorisé. Veuillez vous connecter." }), { status: 401 });
    }

    const userEmail = session.user.email;

    let body;
    try {
        body = await req.json();
    } catch (error) {
        return new Response(JSON.stringify({ error: "Erreur de parsing du JSON." }), { status: 400 });
    }

    const { title, content, photoUrl } = body;

    if (!title || !content) {
        return new Response(JSON.stringify({ error: "Le titre et le contenu sont requis." }), { status: 400 });
    }

    try {
        await connectToDB();

        // Vérifier que l'utilisateur est l'auteur du post
        const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
        if (!post) {
            return new Response(JSON.stringify({ error: "Post non trouvé." }), { status: 404 });
        }

        const user = await User.findOne({ email: userEmail });
        if (!user || post.author.toString() !== user._id.toString()) {
            return new Response(JSON.stringify({ error: "Non autorisé à modifier ce post." }), { status: 403 });
        }

        const updatedPost = {
            title,
            content,
            photoUrl,
            updatedAt: new Date(),
        };

        const result = await db.collection('posts').updateOne(
            { _id: new ObjectId(postId) },
            { $set: updatedPost }
        );

        if (result.modifiedCount === 0) {
            throw new Error("Erreur lors de la mise à jour du post.");
        }

        return new Response(JSON.stringify({ message: "Post mis à jour avec succès", post: updatedPost }), { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du post:", error);
        return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), { status: 500 });
    }
}