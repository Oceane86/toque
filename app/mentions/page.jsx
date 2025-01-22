// pages/mentions.jsx

const MentionsLegales = () => {
    return (
      <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <header>
          <h1>Mentions légales</h1>
          <p>Bienvenue sur notre page des mentions légales.</p>
        </header>
  
        <section>
          <h2>Informations légales</h2>
          <p>Voici les informations légales concernant l’entreprise et son site web :</p>
          <ul>
            <li><strong>Nom de l'entreprise :</strong> VotreEntreprise</li>
            <li><strong>Adresse :</strong> 123 Rue Exemple, Ville, Pays</li>
            <li><strong>Téléphone :</strong> +33 1 23 45 67 89</li>
            <li><strong>Email :</strong> contact@votreentreprise.com</li>
          </ul>
        </section>
  
        <section>
          <h2>Responsabilité</h2>
          <p>
            Les informations fournies sur ce site sont à titre indicatif. L'entreprise n'est pas responsable des erreurs ou omissions.
          </p>
        </section>
      </main>
    );
  };
  
export default MentionsLegales;