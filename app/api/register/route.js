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
            description,
        } = Object.fromEntries(data.entries());

        // Validation des champs obligatoires
        if (!username || !email || !password || !confirmPassword) {
            return NextResponse.json(
                { message: "Tous les champs requis doivent être remplis." },
                { status: 400 }
            );
        }

        // Vérification si l'email existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "L'email est déjà utilisé." },
                { status: 400 }
            );
        }

        const hashedPassword = await hash(password, 10);
        let profileImagePath = "assets/default-profile.png";

        // Validation et téléchargement de l'image de profil
        if (profileImage && profileImage.size > 0) {
            if (profileImage.size > 5 * 1024 * 1024) {
                return NextResponse.json(
                    { message: "L'image de profil ne doit pas dépasser 5 Mo." },
                    { status: 400 }
                );
            }

            const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!allowedTypes.includes(profileImage.type)) {
                return NextResponse.json(
                    { message: "Seuls les fichiers image (JPEG, PNG, GIF) sont autorisés." },
                    { status: 400 }
                );
            }

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

            if (!uploadResult || !uploadResult.secure_url) {
                throw new Error("Erreur lors du téléchargement de l'image");
            }
            profileImagePath = uploadResult.secure_url;
        }

        const cleanDescription = description ? description.replace(/<[^>]*>/g, '') : '';

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            profileImagePath,
            description: cleanDescription,
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
