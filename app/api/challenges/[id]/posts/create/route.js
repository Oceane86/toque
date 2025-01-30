// app/api/challenges/[id]/posts/create/route.js

import { connectToDB } from "@mongodb/database";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

export async function POST(req) {
    const urlParts = req.url.split('/');
    const idIndex = urlParts.indexOf('challenges') + 1;
    const id = urlParts[idIndex];

    if (!id) {
        return new Response(JSON.stringify({ error: "ID manquant dans la requête." }), { status: 400 });
    }

    const session = await getServerSession(req, authOptions);
    if (!session || !session.user) {
        return new Response(JSON.stringify({ error: "Non autorisé. Veuillez vous connecter." }), { status: 401 });
    }

    const userEmail = session.user.email;
    const { title, content, photoUrl } = await req.json();

    if (!title || !content) {
        return new Response(JSON.stringify({ error: "Le titre et le contenu sont requis." }), { status: 400 });
    }

    try {
        const db = await connectToDB();
        const collection = db.collection('posts');

        const newPost = {
            challengeId: new ObjectId(id),
            title,
            content,
            photoUrl,
            author: {
                email: userEmail,
            },
            comments: [],
            createdAt: new Date(),
        };

        const result = await collection.insertOne(newPost);

        if (!result.acknowledged) {
            throw new Error("Erreur lors de la création du post.");
        }

        return new Response(JSON.stringify({ message: "Post créé avec succès", postId: result.insertedId }), { status: 201 });
    } catch (error) {
        console.error("Erreur lors de la création du post:", error);
        return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), { status: 500 });
    }
}