// app/profil/page.jsx

"use client";

import Navbar from '@components/NavBar';
import styles from './profil.module.css';
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react"; 

const ProfilePage = () => {
    const { data: session, status } = useSession();
    const [challenges, setChallenges] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (session) {
            const fetchUserChallenges = async () => {
                try {
                    const response = await fetch(`/api/users/${session.user.id}/challenges`);
                    if (!response.ok) {
                        throw new Error("Erreur lors de la récupération des défis.");
                    }
                    const data = await response.json();
                    setChallenges(data);
                } catch (err) {
                    setError(err.message);
                }
            };

            fetchUserChallenges();
        }
    }, [session]);

    if (status === "loading") {
        return <div className={styles.loading}>Chargement...</div>;
    }

    if (error) {
        return <div className={styles.error}>Erreur: {error}</div>;
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.tabs}>
                    <button
                        className={activeTab === 'profile' ? styles.activeTab : ''}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profil
                    </button>
                    <button
                        className={activeTab === 'history' ? styles.activeTab : ''}
                        onClick={() => setActiveTab('history')}
                    >
                        Historique
                    </button>
                </div>
                {activeTab === 'profile' && (
                    <div className={styles.profile}>
                        <h1>Profil</h1>
                        {session && (
                            <>
                                {session.user.name && <p><strong>Nom:</strong> {session.user.name}</p>}
                                {session.user.email && <p><strong>Email:</strong> {session.user.email}</p>}
                                {session.user.username && <p><strong>Nom d'utilisateur:</strong> {session.user.username}</p>}
                                <button className={styles.logoutButton} onClick={() => signOut()}>
                                    Déconnexion
                                </button>
                            </>
                        )}
                    </div>
                )}
                {activeTab === 'history' && (
                    <div className={styles.history}>
                        <h1>Historique des défis</h1>
                        {challenges.length === 0 ? (
                            <p>Vous n'avez pas encore participé à des défis.</p>
                        ) : (
                            <ul className={styles.challengeList}>
                                {challenges.map((challenge) => (
                                    <li key={challenge.id} className={styles.challengeItem}>
                                        <h2>{challenge.title}</h2>
                                        <p>{challenge.description}</p>
                                        <p><strong>Fin du challenge:</strong> {new Date(challenge.endDate).toLocaleDateString()}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default ProfilePage;