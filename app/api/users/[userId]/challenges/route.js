// pages/api/users/[userId]/challenges/route.js

import { connectToDB } from "@mongodb/database";
import { ObjectId } from "mongodb";
import Challenge from "@models/Challenge";
import User from "@models/User";

export async function GET(req, { params }) {
    const { userId } = params;

    try {
        await connectToDB();

        // Récupérer les défis associés à l'utilisateur
        const user = await User.findOne({ _id: new ObjectId(String(userId)) });

        // Convertir les IDs des défis en ObjectId
        const challengeIds = user.challenges.map(challenge => {
            if (typeof challenge === 'string' || challenge instanceof ObjectId) {
                return new ObjectId(challenge);
            }
            else if (typeof challenge === 'number') {
                return ObjectId.createFromTime(challenge);
            }
            else {
                throw new Error("Type de challenge non pris en charge");
            }
        });

        // Récupérer les défis en fonction des IDs
        const participations = await Challenge.find({ _id: { $in: challengeIds } })
            .sort({ endDate: -1 });

        return new Response(JSON.stringify(participations), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des défis:", error);
        return new Response(JSON.stringify({ error: "Erreur interne du serveur. Veuillez réessayer plus tard." }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}