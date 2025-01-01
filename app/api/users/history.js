// app/api/users/history.js

import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  const { userId } = req.query;
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      return res.status(200).json(user.history);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique utilisateur' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
