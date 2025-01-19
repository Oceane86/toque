// api/challenges/select/route.js

import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb/database";
import Challenge from "@/models/Challenge"; // Assurez-vous que le modèle Challenge est bien défini
import mongoose from "mongoose";

export async function GET(req) {
    try {
        // Connexion à la base de données
        await connectToDB();

        const searchParams = new URL(req.url).searchParams;
        const id = searchParams.get("id");

        // Si aucun ID n'est fourni, on récupère tous les challenges
        if (!id) {
            const challenges = await Challenge.find(); // Récupère tous les challenges
            return createCorsResponse(NextResponse.json(challenges, { status: 200 }));
        }

        // Vérification de la validité de l'ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return createCorsResponse(NextResponse.json({ error: "ID invalide." }, { status: 400 }));
        }

        // Recherche du challenge avec l'ID donné
        const challenge = await Challenge.findById(id);

        // Si le challenge n'est pas trouvé
        if (!challenge) {
            return createCorsResponse(NextResponse.json({ error: "Challenge non trouvé." }, { status: 404 }));
        }

        // Renvoyer le challenge trouvé
        return createCorsResponse(NextResponse.json(challenge, { status: 200 }));
    } catch (error) {
        console.error("Erreur API:", error);
        return createCorsResponse(NextResponse.json({ error: "Erreur serveur." }, { status: 500 }));
    }
}

function createCorsResponse(response) {
    response.headers.set("Access-Control-Allow-Origin", "*"); // À restreindre en production
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
}

// Gestion des requêtes OPTIONS pour CORS
export function OPTIONS() {
    return createCorsResponse(new NextResponse(null, { status: 204 }));
}
