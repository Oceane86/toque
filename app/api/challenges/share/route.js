// app/api/challenges/share/route.js
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configurer Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Désactiver l'Edge Runtime
export const runtime = 'nodejs'; // Passer à node.js runtime

export async function POST(req) {
    try {
        const formData = await req.formData(); // Récupérer le contenu de la requête sous forme de FormData
        const file = formData.get('photo'); // Obtenir le fichier "photo" du FormData

        if (!file) {
            return NextResponse.json(
                { message: "Aucun fichier n'a été fourni." },
                { status: 400 }
            );
        }

        const buffer = await file.arrayBuffer();
        const base64File = Buffer.from(buffer).toString('base64');
        const dataUri = `data:${file.type};base64,${base64File}`;

        // Uploader sur Cloudinary
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'uploads',
        });

        return NextResponse.json(
            { photoUrl: result.secure_url },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        return NextResponse.json(
            { message: "Erreur lors de l'upload de l'image." },
            { status: 500 }
        );
    }
}
