// app/challenges/[id]/page.jsx
"use client";
import Navbar from '@components/NavBar';
import styles from './page.module.css'; 
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signIn } from "next-auth/react"; 

const ChallengePage = ({ params }) => {
    const { id } = params;
    const { data: session, status } = useSession();
    const [challenge, setChallenge] = useState(null);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [isParticipating, setIsParticipating] = useState(false);
    const [showPopup, setShowPopup] = useState(false); 
    const router = useRouter();

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

    

    const handleParticipation = () => {
        setIsParticipating(false);
        setMessage("Vous avez choisi de ne pas participer à ce défi.");
        router.push('/challenges');
    };

    const handleJoinChallenge = async () => {
        if (!session) {
            signIn();
        } else {
            try {
                const response = await fetch('/api/users/participation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: session.user.id, challengeId: id }),
                });
    
                if (!response.ok) {
                    throw new Error("Erreur lors de la mise à jour de la participation.");
                }
    
                setIsParticipating(true);
                setMessage("Vous participez maintenant à ce défi.");
                setShowPopup(true); // Affiche la popup après avoir rejoint le défi
            } catch (error) {
                console.error("Erreur:", error);
                setMessage("Erreur lors de la participation au défi.");
            }
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    if (error) {
        return <div className={styles.error}>Erreur: {error}</div>;
    }

    if (!challenge) {
        return <div className={styles.loading}>Chargement...</div>;
    }

    const instructions = Array.isArray(challenge.instructions) ? challenge.instructions : [];

    return (          
        <>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.title}>{challenge.title}</h1>
                <p className={styles.description}>{challenge.description}</p>

                <button onClick={handleJoinChallenge} className={styles.joinButton}>
                    Je participe
                </button>
                <button onClick={handleParticipation} className={styles.notParticipateButton}>
                    Je ne participe pas
                </button>

                <div className={styles.footer}>
                    <p><strong>Créé par:</strong> {challenge.createdBy}</p>
                    <p><strong>Fin du challenge:</strong> {new Date(challenge.endDate).toLocaleDateString()}</p>
                </div>

                {message && <p className={styles.message}>{message}</p>}

                {showPopup && (
                    <div className={styles.popup}>
                        <div className={styles.popupContent}>
                            <h2>Félicitations!</h2>
                            <p>N'hésitez pas à partager votre plat avec les autres participants.</p>
                            <Link href={`/challenges/${id}/partage`}>
                                <button>Partager votre plat</button>
                            </Link>
                            <button onClick={closePopup}>Fermer</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ChallengePage;