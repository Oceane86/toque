// app/api/register/route.js
import { connectToDB } from "@/mongodb/database";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import cloudinary from "cloudinary";
import { Readable } from "stream";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    try {
        await connectToDB();
        const data = await req.formData();

        const {
            username,
            email,
            password,
            confirmPassword,
            profileImage,
            status,
            description,
        } = Object.fromEntries(data.entries());

        if (!username || !email || !password || !status) {
            return NextResponse.json(
                { message: "Tous les champs requis doivent être remplis." },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { message: "Les mots de passe ne correspondent pas." },
                { status: 400 }
            );
        }

        const hashedPassword = await hash(password, 10);
        let profileImagePath = "assets/default-profile.png";

        if (profileImage && typeof profileImage.arrayBuffer === "function") {
            const buffer = Buffer.from(await profileImage.arrayBuffer());
            const stream = Readable.from(buffer);
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    { folder: "user_profiles" },
                    (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    }
                );
                stream.pipe(uploadStream);
            });
            profileImagePath = uploadResult.secure_url;
        }

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            profileImagePath,
            status,
            description: description || "",
            challengeIds: [], // Initialiser avec une liste vide
        });

        await newUser.save();
        
        return NextResponse.json(
            { message: "Utilisateur enregistré avec succès. Connectez-vous maintenant." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}
