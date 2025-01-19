// app/challenges/[id]/page.jsx


"use client";
import Navbar from '@components/NavBar';
import styles from './page.module.css'; 
import { useEffect, useState } from "react";
import Link from '@node_modules/next/link';

const ChallengePage = ({ params }) => {
    const { id } = params;
    const [challenge, setChallenge] = useState(null);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null); // Photo du plat
    const [sharedPhotos, setSharedPhotos] = useState([]); // Photos partagées par les utilisateurs
    const [message, setMessage] = useState(""); // Message d'erreur ou de succès

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await fetch(`/api/challenges/select?id=${id}`);
                if (!response.ok) {
                    throw new Error("Challenge non trouvé.");
                }
                const data = await response.json();
                setChallenge(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchChallenge();
    }, [id]);

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
            const response = await fetch(`/api/challenges/share-photo`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erreur lors du partage de la photo.");
            }

            const data = await response.json();
            setSharedPhotos([...sharedPhotos, data.photoUrl]); // Mettre à jour les photos partagées
            setMessage("Photo partagée avec succès !");
            setFile(null);
        } catch (err) {
            setMessage(err.message);
        }
    };

    if (error) {
        return <div className={styles.error}>Erreur: {error}</div>;
    }

    if (!challenge) {
        return <div className={styles.loading}>Chargement...</div>;
    }

    return (          
        <>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.title}>{challenge.title}</h1>
                <p className={styles.description}>{challenge.description}</p>

                <div className={styles.ingredients}>
                    <h2>Ingrédients</h2>
                    <ul>
                        {challenge.ingredients && challenge.ingredients.length > 0 ? (
                            challenge.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))
                        ) : (
                            <p>Aucun ingrédient spécifié</p>
                        )}
                    </ul>
                </div>

                <div className={styles.instructions}>
                    <h2>Instructions</h2>
                    <ol>
                        {challenge.instructions && challenge.instructions.split('\n').map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>

                 {/* Lien vers la page d'upload */}
                 <div className={styles.share}>
                    <h3>Partagez votre plat avec une photo</h3>
                    <Link href={`/challenges/${id}/partage`}>
                        <button>Ajouter une photo</button>
                    </Link>
                </div>

                

                <div className={styles.footer}>
                    <p><strong>Créé par:</strong> {challenge.createdBy}</p>
                    <p><strong>Fin du challenge:</strong> {new Date(challenge.endDate).toLocaleDateString()}</p>
                </div>
            </div>
        </>
    );
};

export default ChallengePage;
