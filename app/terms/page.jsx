// app/terms/page.jsx
import Navbar from "@components/NavBar";
import styles from "./Terms.module.css";
import Footer from "@components/Footer";

const Terms = () => {
  return (
    <main className={styles.termsContainer}>
      <Navbar />
      <header className={styles.termsHeader}>
        <h1>Conditions Générales d'Utilisation</h1>
        <p>
          Bienvenue sur notre application Toque en Duel. Veuillez lire
          attentivement ces conditions générales d'utilisation.
        </p>
      </header>

      <section className={styles.termsSection}>
        <h2>1. Introduction</h2>
        <p>
          En utilisant cette application, vous acceptez les présentes conditions
          générales d'utilisation. Si vous n'êtes pas d'accord, veuillez ne pas
          utiliser notre service.
        </p>
      </section>

      <section className={styles.termsSection}>
        <h2>2. Utilisation de l'Application</h2>
        <p>
          Vous acceptez d'utiliser l'application uniquement à des fins légales
          et conformément aux lois en vigueur. Toute utilisation abusive est
          strictement interdite.
        </p>
      </section>

      <section className={styles.termsSection}>
        <h2>3. Protection des Données</h2>
        <p>
          Nous respectons votre vie privée et vos données personnelles.
          Consultez notre politique de confidentialité pour plus d'informations.
        </p>
      </section>

      <section className={styles.termsSection}>
        <h2>4. Responsabilités</h2>
        <p>
          Nous ne pouvons être tenus responsables des dommages résultant de
          l'utilisation de cette application. Vous êtes seul responsable des
          données que vous partagez.
        </p>
      </section>

      <section className={styles.termsSection}>
        <h2>5. Modifications des Conditions</h2>
        <p>
          Nous nous réservons le droit de modifier ces conditions générales à
          tout moment. Les changements seront effectifs dès leur publication.
        </p>
      </section>

      <Footer />
    </main>
  );
};

export default Terms;
