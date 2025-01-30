// app/api/users/participation/route.js 
import User from '@models/User'; 
import Challenge from '@models/Challenge'; 
import { connectToDB } from "@/mongodb/database";

export async function POST(request) { const { userId, challengeId } = await request.json();



if (!userId || !challengeId) {
    return new Response(JSON.stringify({ message: 'userId et challengeId sont requis.' }), { status: 400 });
}

try {
    await connectToDB();

    const user = await User.findById(userId);
    if (!user) {
        return new Response(JSON.stringify({ message: 'Utilisateur non trouvé.' }), { status: 404 });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
        return new Response(JSON.stringify({ message: 'Challenge non trouvé.' }), { status: 404 });
    }

    // Ajoutez l'ID du défi à la liste des défis de l'utilisateur
    if (!user.challengeIds.includes(challengeId)) {
        user.challengeIds.push(challengeId);
        await user.save();
    }

    return new Response(JSON.stringify({ 
        message: 'Participation mise à jour avec succès.',
        challengeTitle: challenge.title 
    }), { status: 200 });
} catch (error) {
    console.error('Erreur lors de la mise à jour de la participation:', error);
    return new Response(JSON.stringify({ message: 'Erreur du serveur.' }), { status: 500 });
}
}