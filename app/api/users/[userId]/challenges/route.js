// pages/api/users/[userId]/challenges/route.js

import { connectToDB } from "@mongodb/database";
import { ObjectId } from "mongodb";
import Challenge from "@models/Challenge";

export async function GET(req, { params }) {
    const { userId } = params;

    try {
        await connectToDB();

        const participations = await Challenge.find({ participants: new ObjectId(userId) })
            .sort({ endDate: -1 });

        return new Response(JSON.stringify(participations), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des défis:", error);

        // Enhanced error handling
        return new Response(JSON.stringify({ error: "Erreur interne du serveur. Veuillez réessayer plus tard." }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}