// app/challenges/[id]/posts/create/page.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./createPost.module.css";
import Navbar from "@components/NavBar";
import Footer from "@components/Footer";

const CreatePostPage = ({ params }) => {
    const { id } = params;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null); 
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            if (file) {
                formData.append("file", file);
            }

            const response = await fetch(`/api/challenges/${id}/posts/create`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la création du post.");
            }

            // Rediriger vers la page des posts après la création
            router.push(`/challenges/${id}/partage`);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.title}>Créer un Nouveau Post</h1>
                {error && <div className={styles.error}>Erreur: {error}</div>}
                <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
                    <div className={styles.formGroup}>
                        <label htmlFor="title">Titre</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="content">Contenu</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            className={styles.textarea}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="file">Télécharger un fichier</label>
                        <input
                            type="file"
                            id="file"
                            onChange={handleFileChange}
                            className={styles.input}
                        />
                    </div>
                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                        {isSubmitting ? "Création..." : "Créer le Post"}
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default CreatePostPage;