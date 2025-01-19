// app/challenges/[id]/partage/page.jsx
"use client"; 

import { useState } from "react";
import Link from "next/link"; 
import styles from './upload.module.css'; 
import Navbar from "@components/NavBar";

const UploadPhotoPage = ({ params }) => {
    const { id } = params; // Récupérer l'ID du challenge
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [isUploaded, setIsUploaded] = useState(false); // Variable pour contrôler la redirection

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmitPhoto = async () => {
        if (!file) {
            setMessage("Veuillez télécharger une photo.");
            return;
        }
        const formData = new FormData();
        formData.append("photo", file);
        formData.append("challengeId", id);

        try {
            const response = await fetch(`/api/challenges/share`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erreur lors du partage de la photo.");
            }

            const data = await response.json();
            setMessage("Photo partagée avec succès !");
            setFile(null);
            setIsUploaded(true); // Changer l'état pour activer le lien de redirection

        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <><Navbar /><div className={styles.container}>
            <h1>Ajouter une photo de votre plat</h1>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange} />
            <button onClick={handleSubmitPhoto}>Partager la photo</button>
            {message && <p>{message}</p>}

            {/* Afficher un lien pour rediriger si la photo a été téléchargée */}
            {isUploaded && (
                <div>
                    <p>Votre photo a été partagée avec succès !</p>
                    <Link href={`/challenges/${id}`}>
                        <a>Retourner au challenge</a>
                    </Link>
                </div>
            )}
        </div></>
    );
};

export default UploadPhotoPage;
