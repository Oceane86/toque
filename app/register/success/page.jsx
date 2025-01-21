// app/register/success/page.jsx

"use client";
import { useRouter } from 'next/navigation';
import Navbar from '@components/NavBar';
import styles from './success.module.css';

const SuccessPage = () => {
    const router = useRouter();

    return (
        <>
            <Navbar />
            <div className={styles.login}>
                <div className={styles.login_content}>
                    <img src="/assets/icon-success.svg" alt="Icon success" />
                    <h1>Succès</h1>
                    <p>Votre compte a été créé avec succès !</p>
                    <button onClick={() => router.push('/')}>Voir les défis</button>
                </div>
            </div>
        </>
    );
};

export default SuccessPage;
