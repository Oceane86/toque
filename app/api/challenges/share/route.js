// app/api/challenges/share/route.js

import multer from 'multer';
import path from 'path';
import { NextResponse } from 'next/server';

// Configurer multer pour l'upload de fichiers
const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads/', 
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname)); 
        },
    }),
});

// Désactiver le bodyParser directement dans la fonction de gestion de requête
export const runtime = 'edge';

export async function POST(req) {
    return new Promise((resolve, reject) => {
        console.log('Début de la gestion de l\'upload');  // Log ajouté

        upload.single('photo')(req, {}, (err) => {
            if (err) {
                console.error('Erreur d\'upload:', err);  // Log détaillé de l'erreur
                reject(
                    NextResponse.json({ message: "Erreur lors de l'upload de l'image." }, { status: 500 })
                );
                return; // Arrêter l'exécution si une erreur survient
            }

            // Vérifier si req.file existe
            if (!req.file) {
                console.error('Aucun fichier trouvé dans req.file');  
                reject(
                    NextResponse.json({ message: "Aucun fichier n'a été téléchargé." }, { status: 400 })
                );
                return;
            }

            const photoUrl = `/uploads/${req.file.filename}`; 
            console.log('Upload réussi, URL de l\'image:', photoUrl);  // Log de l'URL de l'image


            resolve(
                NextResponse.json({ photoUrl }, { status: 200 })
            );
        });
    });
}
