// app/api/posts/[postId]/update/route.js

import { NextResponse } from "next/server";
import { connectToDB } from "@mongodb/database";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import Post from "@models/Post";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req, { params }) {
    const { postId } = params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json(
            { message: "Vous devez être connecté pour modifier ce post." },
            { status: 401 }
        );
    }

    try {
        await connectToDB();
        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json(
                { message: "Post non trouvé." },
                { status: 404 }
            );
        }

        if (post.author.toString() !== session.user.id) {
            return NextResponse.json(
                { message: "Vous n'êtes pas autorisé à modifier ce post." },
                { status: 403 }
            );
        }

        const data = await req.formData();
        const { title, content, challengeId } = Object.fromEntries(data.entries());
        const photo = data.get("photo");

        if (!title || !content || !challengeId) {
            return NextResponse.json(
                { message: "Tous les champs requis doivent être remplis." },
                { status: 400 }
            );
        }

        let photoUrl = post.photoUrl;

        if (photo && typeof photo.size === "number" && photo.size > 0) {
            try {
                const arrayBuffer = await photo.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const uploadResult = await cloudinary.v2.uploader.upload(
                    `data:image/jpeg;base64,${buffer.toString("base64")}`,
                    { folder: "post_photos" }
                );

                if (uploadResult?.secure_url) {
                    photoUrl = uploadResult.secure_url;
                } else {
                    throw new Error("Échec de l'upload de la photo.");
                }
            } catch (uploadError) {
                console.error("Erreur lors de l'upload de la photo:", uploadError);
                return NextResponse.json(
                    { message: "Erreur lors de l'upload de la photo." },
                    { status: 500 }
                );
            }
        }

        const updateData = { title, content, challengeId, photoUrl };
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $set: updateData },
            { new: true }
        );

        if (!updatedPost) {
            return NextResponse.json(
                { message: "Échec de la mise à jour du post." },
                { status: 500 }
            );
        }

        return NextResponse.json(updatedPost, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du post:", error);
        return NextResponse.json(
            { error: error.message || "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}

export function OPTIONS() {
    const response = new NextResponse(null, { status: 204 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "PUT, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
}
