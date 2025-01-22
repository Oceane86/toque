// app/confidentialite/page.jsx

const Confidentialite = () => {
    return (
      <main className="confidentialite-container">
        <header className="confidentialite-header">
          <h1>Règles de confidentialité</h1>
          <p>Découvrez comment nous protégeons vos données personnelles.</p>
        </header>
  
        <section className="confidentialite-section">
          <h2>Introduction</h2>
          <p>
            Votre vie privée est importante pour nous. Cette page explique les types de données
            que nous collectons et comment elles sont utilisées.
          </p>
        </section>
  
        <section className="confidentialite-section">
          <h2>Données collectées</h2>
          <ul>
            <li>Informations personnelles : nom, email, adresse.</li>
            <li>Données techniques : adresse IP, type de navigateur.</li>
            <li>Cookies pour améliorer votre expérience utilisateur.</li>
          </ul>
        </section>
  
        <section className="confidentialite-section">
          <h2>Utilisation des données</h2>
          <p>
            Les données collectées sont utilisées pour fournir et améliorer nos services, ainsi que pour
            des analyses internes.
          </p>
        </section>
  
        <section className="confidentialite-section">
          <h2>Vos droits</h2>
          <p>
            Vous avez le droit d'accéder, de modifier ou de supprimer vos données personnelles.
            Contactez-nous pour toute demande.
          </p>
        </section>
  
        <footer className="confidentialite-footer">
          <p>&copy; {new Date().getFullYear()} Toque en Duel. Tous droits réservés.</p>
        </footer>
      </main>
    );
  };
  
  export default Confidentialite;