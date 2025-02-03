// app/api/challenges/[id]/select/route.js

import { connectToDB } from "@/mongodb/database";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { challengeId } = params;

        const connection = await connectToDB();
        if (!connection) {
            console.error('Échec de la connexion à la base de données.');
            return NextResponse.json(
                { message: "Erreur de connexion à la base de données." },
                { status: 500 }
            );
        }

        const { db, client } = connection;

        const photos = await db.collection('challenges')
            .find({ challengeId: challengeId })
            .project({ photoUrl: 1, _id: 0 })
            .toArray();

        await client.close();

        if (photos.length === 0) {
            return NextResponse.json(
                { message: "Aucune photo trouvée pour ce challenge." },
                { status: 404 }
            );
        }

        return NextResponse.json(photos, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la récupération des photos:', error);
        return NextResponse.json(
            { message: "Erreur lors de la récupération des photos.", error: error.message },
            { status: 500 }
        );
    }
}
