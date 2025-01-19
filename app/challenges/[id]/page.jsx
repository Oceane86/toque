// app/challenges/[id]/page.jsx
"use client";
import Navbar from '@components/NavBar';
import styles from './page.module.css'; 
import { useEffect, useState } from "react";

const ChallengePage = ({ params }) => {
    const { id } = params;
    const [challenge, setChallenge] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await fetch(`/api/challenges/select?id=${id}`);
                if (!response.ok) {
                    throw new Error("Challenge non trouvé.");
                }
                const data = await response.json();
                if (!data) {
                    throw new Error("Aucune donnée reçue.");
                }
                setChallenge(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchChallenge();
    }, [id]);

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

                <div className={styles.footer}>
                    <p><strong>Créé par:</strong> {challenge.createdBy}</p>
                    <p><strong>Fin du challenge:</strong> {new Date(challenge.endDate).toLocaleDateString()}</p>
                </div>
            </div>
        </>
    );
};

export default ChallengePage;
