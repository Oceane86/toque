// app/challenges/[id]/partage/page.jsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./upload.module.css";
import Navbar from "@components/NavBar";
import Footer from "@components/Footer";

const PartagePage = ({ params }) => {
    const { id } = params;
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [photo, setPhoto] = useState(null);
    const [editPostId, setEditPostId] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Nouvel état pour gérer l'ouverture de la popup
    const router = useRouter();

    const { data: session } = useSession();

    useEffect(() => {
        if (!session) {
            router.push("/login");
        }
    }, [session, router]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`/api/challenges/${id}/posts/select`);
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des posts.");
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err.message);
            }
        };

        if (session) {
            fetchPosts();
        }
    }, [id, session]);

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("challengeId", id);
        if (photo) {
            formData.append("photo", photo);
        }

        try {
            const url = editPostId
                ? `/api/posts/${editPostId}/update`
                : "/api/posts/create";
            const method = editPostId ? "PUT" : "POST";
            const response = await fetch(url, {
                method,
                body: formData,
            });

            if (!response.ok) {
                throw new Error(
                    editPostId
                        ? "Erreur lors de la mise à jour du post."
                        : "Erreur lors de la création du post."
                );
            }

            const updatedPost = await response.json();
            if (editPostId) {
                setPosts(
                    posts.map((post) => (post._id === editPostId ? updatedPost : post))
                );
                setEditPostId(null);
            } else {
                setPosts([...posts, updatedPost]);
            }

            setTitle("");
            setContent("");
            setPhoto(null);
            setIsPopupOpen(false); // Ferme la popup après l'envoi du formulaire
            alert(
                editPostId ? "Post mis à jour avec succès!" : "Post créé avec succès!"
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (post) => {
        setEditPostId(post._id);
        setTitle(post.title);
        setContent(post.content);
        setPhoto(null);
        setIsPopupOpen(true); // Ouvre la popup pour modifier un post
    };

    const handleDelete = async (postId) => {
        try {
            const response = await fetch(`/api/posts/${postId}/delete`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la suppression du post.");
            }

            setPosts(posts.filter((post) => post._id !== postId));
            alert("Post supprimé avec succès!");
        } catch (err) {
            setError(err.message);
        }
    };

    const openPopup = () => {
        setEditPostId(null);
        setTitle("");
        setContent("");
        setPhoto(null);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    if (!session) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Accès refusé</h1>
                <p>Vous devez être connecté pour accéder à cette page.</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>Erreur: {error}</div>;
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.title}>Posts Partagés</h1>

                {posts.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Soyez le premier à poster pour ce défi !</p>
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Soyez le premier à poster"
                            className={styles.emptyImage}
                        />
                    </div>
                ) : (
                    <div className={styles.postGrid}>
                        {posts.map((post, index) => (
                            <div key={index} className={styles.postCard}>
                                {post.photoUrl && (
                                    <img
                                        src={post.photoUrl}
                                        alt={`Photo partagée par ${post.author?.name || "anonyme"}`}
                                        className={styles.photo}
                                    />
                                )}
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
                                {post.author && post.author._id && session.user?.id ? (
                                    post.author._id === session.user.id && (
                                        <>
                                            <button
                                                onClick={() => handleEdit(post)}
                                                className={styles.editButton}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post._id)}
                                                className={styles.deleteButton}
                                            >
                                                Supprimer
                                            </button>
                                        </>
                                    )
                                ) : (
                                    <div className={styles.noAuthMessage}>
                                        Vous n'avez pas le droit de modifier ce post
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <button onClick={openPopup} className={styles.createPostButton}>
                    {editPostId ? "Modifier le post" : "Créer un nouveau post"}
                </button>

                {isPopupOpen && (
                    <div className={styles.popup}>
                        <div className={styles.popupContent}>
                            <h2>{editPostId ? "Modifier le post" : "Créer un nouveau post"}</h2>
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <input
                                    type="text"
                                    placeholder="Titre"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className={styles.input}
                                />
                                <textarea
                                    placeholder="Contenu"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    className={styles.textarea}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className={styles.fileInput}
                                />
                                <button type="submit" className={styles.submitButton}>
                                    {editPostId ? "Mettre à jour" : "Publier"}
                                </button>
                                <button type="button" onClick={closePopup} className={styles.closeButton}>
                                    Fermer
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default PartagePage;
