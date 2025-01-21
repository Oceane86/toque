// app/login/page.jsx

"use client";

import styles from './login.module.css';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from '@components/NavBar';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [acceptConditions, setAcceptConditions] = useState(false); 
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérifier si la condition générale est acceptée
        if (!acceptConditions) {
            setError("Vous devez accepter les conditions générales.");
            return;
        }

        try {
            const response = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });
            if (response.ok) {
                router.push("/");
            } else {
                setError("Email ou mot de passe invalide.");
            }
        } catch (error) {
            console.log("Error logging in: ", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles['login-page']}>
                <div className={styles['login']}>
                    <div className={styles['login_content']}>
                        <h1 className={styles['gradient-color']}>Connectez-vous</h1>
                        <form className={styles['login_content_form']} onSubmit={handleSubmit}>
                            <label>Adresse mail</label>
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label>Mot de passe</label>
                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            {/* Checkbox pour accepter les conditions générales */}
                            <div className={styles['terms-checkbox']}>
                                <input
                                    type="checkbox"
                                    id="acceptConditions"
                                    checked={acceptConditions}
                                    onChange={(e) => setAcceptConditions(e.target.checked)}
                                />
                                <label htmlFor="acceptConditions">
                                    J'accepte les <a href="/terms" target="_blank">conditions générales</a>
                                </label>
                            </div>

                            {error && <p className={styles.error}>{error}</p>}

                            <button type="submit">Se connecter</button>
                        </form>

                        <div className={styles['login_content_rs']}>
                            <div>
                                <p>Ou continuez avec</p>
                                <div className="d-flex column-gap-3">
                                    <button className={styles.rs} onClick={() => signIn('google')}>
                                        <img src="/assets/icon-google.svg" alt="Icon Google" />
                                    </button>
                                </div>
                            </div>
                            <a href="/register">Vous n'avez pas de compte ? S'inscrire</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
