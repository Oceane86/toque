// app/register/success/page.jsx
"use client";
import { useRouter } from 'next/navigation';

const SuccessPage = () => {
    const router = useRouter();

    return (
        <>
            <div className="login">
                <div className="login_content">
                    <img src="/assets/icon-success.svg" alt="Icon success" />
                    <h1>Succès</h1>
                    <p>Votre compte a été créé avec succès !</p>
                    <button onClick={() => router.push('/')}>Participer aux challenges</button>
                </div>
            </div>
        </>
    );
};

export default SuccessPage;
