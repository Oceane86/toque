// app/api/users/profile.js

import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  const { userId } = req.query;
  await dbConnect();

  if (req.method === 'PUT') {
    try {
      const { name, email, profilePicture } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, profilePicture },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
