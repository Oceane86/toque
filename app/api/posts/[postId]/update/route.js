// app/api/posts/[postId]/update/route.js

import { NextResponse } from "next/server";
import { connectToDB } from "@mongodb/database";
import { ObjectId } from "mongodb";
import Post from "@models/Post";

export async function PUT(req, { params }) {
    const { postId } = params;
    console.log('ID du post:', postId); // Log pour vérifier l'ID

    try {
        await connectToDB(); // Connexion à la base de données
  
        const data = await req.formData();
        const { title, content, challengeId } = Object.fromEntries(data.entries());
        const photo = data.get('photo');
  
        if (!title || !content || !challengeId) {
            return NextResponse.json({ message: "Tous les champs requis doivent être remplis." }, { status: 400 });
        }
  
        let photoUrl;
        if (photo && typeof photo.size === "number" && photo.size > 0) {
            try {
                const arrayBuffer = await photo.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
  
                if (!Buffer.isBuffer(buffer)) {
                    throw new Error("Conversion en Buffer a échoué.");
                }
  
                const uploadResult = await cloudinary.v2.uploader.upload(`data:image/jpeg;base64,${buffer.toString('base64')}`, {
                    folder: "post_photos"
                });
  
                if (uploadResult?.secure_url) {
                    photoUrl = uploadResult.secure_url;
                } else {
                    throw new Error("Échec de l'upload de la photo.");
                }
            } catch (uploadError) {
                console.error("Erreur lors de l'upload de la photo:", uploadError);
                return NextResponse.json({ message: "Erreur lors de l'upload de la photo." }, { status: 500 });
            }
        }
  
        const updateData = { title, content, challengeId };
        if (photoUrl) {
            updateData.photoUrl = photoUrl;
        }
  
        const result = await Post.findOneAndUpdate(
            { _id: new ObjectId(postId) },
            { $set: updateData },
            { new: true } // Retourner le document mis à jour
        );
  
        if (!result) {
            return NextResponse.json({ message: "Post non trouvé." }, { status: 404 });
        }
  
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du post:", error);
        return NextResponse.json({ error: error.message || "Erreur interne du serveur." }, { status: 500 });
    }
}

export function OPTIONS() {
  return createCorsResponse(new NextResponse(null, { status: 204 }));
}

function createCorsResponse(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "PUT, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}