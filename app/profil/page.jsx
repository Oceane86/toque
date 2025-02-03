// app/profil/page.jsx
"use client";

import Navbar from '@components/NavBar';
import styles from './profil.module.css';
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Loader from '@components/Loader';

const ProfilePage = () => {
    const { data: session, status } = useSession();
    const [challenges, setChallenges] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [currentPage, setCurrentPage] = useState(1);
    const challengesPerPage = 3; // Nombre de défis à afficher par page
    const router = useRouter();

    useEffect(() => {
        // Redirection si l'utilisateur n'est pas authentifié
        if (status === "unauthenticated") {
            router.push('/login');
        }

        // Récupérer les défis de l'utilisateur
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
    }, [session, status, router]);

    // Calculer les défis à afficher pour la page actuelle
    const indexOfLastChallenge = currentPage * challengesPerPage;
    const indexOfFirstChallenge = indexOfLastChallenge - challengesPerPage;
    const currentChallenges = challenges.slice(indexOfFirstChallenge, indexOfLastChallenge);

    const totalPages = Math.ceil(challenges.length / challengesPerPage);

    // Gérer la pagination
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Si les données sont en cours de chargement

    if (status === "loading") {
        return <Loader/>;
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
                
                {/* Profil */}
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

                {/* Historique */}
                {activeTab === 'history' && (
                    <div className={styles.history}>
                        <h1>Historique des défis</h1>
                        {challenges.length === 0 ? (
                            <p>Vous n'avez pas encore participé à des défis.</p>
                        ) : (
                            <>
                                <ul className={styles.challengeList}>
                                    {currentChallenges.map((challenge) => (
                                        <li key={challenge.id} className={styles.challengeItem}>
                                            <h2>{challenge.title}</h2>
                                            <p>{challenge.description}</p>
                                            <p><strong>Fin du challenge:</strong> {new Date(challenge.endDate).toLocaleDateString()}</p>
                                        </li>
                                    ))}
                                </ul>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className={styles.pagination}>
                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => paginate(index + 1)}
                                                className={currentPage === index + 1 ? styles.activePage : ''}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default ProfilePage;
