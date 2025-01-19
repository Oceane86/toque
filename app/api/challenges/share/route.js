// app/api/challenges/share/route.js


import multer from 'multer';
import path from 'path';

// Configurer multer pour l'upload de fichiers
const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads/', // Dossier où les fichiers seront stockés
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname)); // Nom unique pour chaque fichier
        },
    }),
});

export const config = {
    api: {
        bodyParser: false, // Désactive le bodyParser de Next.js pour utiliser multer
    },
};

// Fonction pour gérer la requête POST
export async function POST(req) {
    return new Promise((resolve, reject) => {
        console.log('Début de la gestion de l\'upload');  // Log ajouté

        upload.single('photo')(req, {}, (err) => {
            if (err) {
                console.error('Erreur d\'upload:', err);  // Log détaillé de l'erreur
                reject(new Response(JSON.stringify({ message: "Erreur lors de l'upload de l'image." }), { status: 500 }));
                return;  // Arrêter l'exécution si une erreur survient
            }

            // Vérifier si req.file existe
            if (!req.file) {
                console.error('Aucun fichier trouvé dans req.file');  // Log si le fichier est manquant
                reject(new Response(JSON.stringify({ message: "Aucun fichier n'a été téléchargé." }), { status: 400 }));
                return;
            }

            const photoUrl = `/uploads/${req.file.filename}`; // URL de la photo téléchargée
            console.log('Upload réussi, URL de l\'image:', photoUrl);  // Log de l'URL de l'image

            // Si nécessaire, tu peux enregistrer cette URL dans la base de données ici

            resolve(new Response(JSON.stringify({ photoUrl }), { status: 200 }));
        });
    });
}
