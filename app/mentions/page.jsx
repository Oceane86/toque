// pages/mentions.jsx

import Navbar from "@components/NavBar";
import Footer from "@components/Footer";

const MentionsLegales = () => {
  return (
    <main>
      <Navbar />
      <header>
        <h1>Mentions légales</h1>
        <p>Bienvenue sur notre page des mentions légales.</p>
      </header>

      <section>
        <h2>Informations légales</h2>
        <p>
          Voici les informations légales concernant l’entreprise et son site web :
        </p>
        <ul>
          <li>
            <strong>Nom de l'entreprise :</strong> Toque en duel
          </li>
          <li>
            <strong>Adresse :</strong> 123 Rue de la fontaine, Paris, France
          </li>
          <li>
            <strong>Téléphone :</strong> +33 1 23 45 67 89
          </li>
          <li>
            <strong>Email :</strong> contact@toque-en-duel.com
          </li>
          <li>
            <strong>SIRET :</strong> 123 456 789 00012
          </li>
          <li>
            <strong>Numéro TVA intracommunautaire :</strong> FR123456789
          </li>
        </ul>
      </section>

      <section>
        <h2>Responsabilité</h2>
        <p>
          Les informations fournies sur ce site sont à titre indicatif. L'entreprise
          n'est pas responsable des erreurs ou omissions.
        </p>
        <p>
          L'entreprise décline toute responsabilité concernant l'utilisation des informations présentes sur ce site.
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Le contenu du site, y compris mais sans s'y limiter, les textes, images, logos et marques, est protégé par des droits de
          propriété intellectuelle. Toute reproduction, distribution ou utilisation non autorisée est interdite.
        </p>
      </section>

      <section>
        <h2>Politique de confidentialité</h2>
        <p>
          Nous respectons votre vie privée et nous engageons à protéger vos données personnelles. Veuillez consulter notre
          <a href="/confidentialite">politique de confidentialité</a> pour plus d'informations sur la collecte et l'utilisation de vos données.
        </p>
      </section>


      <section>
        <h2>Conditions d'utilisation</h2>
        <p>
          En utilisant ce site, vous acceptez les conditions d'utilisation. Pour plus de détails, veuillez lire notre
          <a href="/terms">politique de conditions d'utilisation</a>.
        </p>
      </section>

      <Footer />
    </main>
  );
};

export default MentionsLegales;
