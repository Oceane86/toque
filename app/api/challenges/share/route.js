// app/api/challenges/share/route.js

import multer from 'multer';
import { NextResponse } from 'next/server';

function getFileExtension(filename) {
    return filename.substring(filename.lastIndexOf('.'));
}

// Configuration de multer pour l'upload de fichiers localement
const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads/', 
        filename: (req, file, cb) => {
            cb(null, Date.now() + getFileExtension(file.originalname)); 
        },
    }),
});

export const runtime = 'edge';

// Gestion de l'upload des fichiers via POST
export async function POST(req) {
    return new Promise((resolve, reject) => {
        console.log('Début de la gestion de l\'upload'); 

        upload.single('photo')(req, {}, (err) => {
            if (err) {
                console.error('Erreur d\'upload:', err); 
                reject(
                    NextResponse.json({ message: "Erreur lors de l'upload de l'image." }, { status: 500 })
                );
                return;
            }

            if (!req.file) {
                console.error('Aucun fichier trouvé dans req.file');
                reject(
                    NextResponse.json({ message: "Aucun fichier n'a été téléchargé." }, { status: 400 })
                );
                return;
            }

            // Générer l'URL de la photo uploadée
            const photoUrl = `/uploads/${req.file.filename}`;
            console.log('Upload réussi, URL de l\'image:', photoUrl);

            resolve(
                NextResponse.json({ photoUrl }, { status: 200 })
            );
        });
    });
}
