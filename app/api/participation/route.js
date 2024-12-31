// app/api/participation/route.js

import mongoose from 'mongoose';
import User from '@models/User';
import Challenge from '@models/Challenge';

const { ObjectId } = mongoose.Types;

// Fonction pour ajouter un défi à un utilisateur
const addChallengeToUser = async (userId, challengeId) => {
    try {
        // Vérifiez si l'ID du défi est valide
        if (!ObjectId.isValid(challengeId)) {
            throw new Error('ID de défi invalide');
        }
        const challengeObjectId = new ObjectId(challengeId);

        // Vérifiez si le défi existe
        const challenge = await Challenge.findById(challengeObjectId);
        if (!challenge) {
            throw new Error('Défi non trouvé');
        }

        // Vérifiez si l'ID de l'utilisateur est valide
        if (!ObjectId.isValid(userId)) {
            throw new Error('ID utilisateur invalide');
        }
        const userObjectId = new ObjectId(userId);

        // Trouvez l'utilisateur par son ID
        const user = await User.findById(userObjectId);
        if (!user) {
                  throw new Error('Utilisateur non trouvé');
        }

        // Ajoutez l'ID du défi à la liste des défis de l'utilisateur
        user.challengeIds.push(challengeObjectId);

        // Sauvegardez les modifications de l'utilisateur
        await user.save();

        console.log('Défi ajouté avec succès');
    } catch (err) {
        console.error('Erreur lors de l\'ajout du défi :', err);
        throw err; // Relancer l'erreur pour que la route puisse la gérer
    }
};

// Exemple de gestionnaire de route POST
export async function POST(req) {
    try {
        const { userId, challengeId } = await req.json();

        // Vérifiez que les IDs sont valides
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(challengeId)) {
            console.error('ID utilisateur ou défi invalide', { userId, challengeId });
            return new Response(JSON.stringify({ error: 'ID utilisateur ou défi invalide' }), { status: 400 });
        }

        // Appel de la fonction pour ajouter le défi
        await addChallengeToUser(userId, challengeId);

        return new Response(JSON.stringify({ message: 'Défi ajouté avec succès' }), { status: 200 });
    } catch (err) {
        console.error('Erreur dans la route POST :', err); // Ajout d'un log détaillé
        return new Response(JSON.stringify({ error: `Erreur lors de l'ajout du défi : ${err.message}` }), { status: 500 });
    }
}
