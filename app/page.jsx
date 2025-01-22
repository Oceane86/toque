
// app/page.jsx

"use client";
import '../styles/globals.css';
import Navbar from '@components/NavBar';
import Footer from '@components/Footer';

const Home = () => {
  return (
    <main className="main-container">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">
          Bienvenue sur <span className="highlight">Toque en duel</span>
        </h1>
        <p className="hero-description">
          Découvrez une nouvelle façon de simplifier votre quotidien pour apprendre de nouvelles recettes et défier vous.
        </p>
        <button className="hero-button">
          En savoir plus
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2 className="features-title">
          Découvrir de nouvelles recettes
        </h2>
        <div className="features-cards">
          <div className="feature-card">
            <h3 className="feature-title">Feature 1</h3>
            <p className="feature-description">
              Une description concise de la première fonctionnalité clé qui change tout.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">De nouveaux défis chaque semaine</h3>
            <p className="feature-description">
              De nouveaux défis chaque semaine avec l'ia
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Feature 3</h3>
            <p className="feature-description">
              Transformez votre expérience utilisateur grâce à cette option unique.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section id="about" className="cta">
        <h2 className="cta-title">
          Rejoignez-nous dès aujourd'hui !
        </h2>
        <p className="cta-description">
          Créez votre compte et commencez à profiter des avantages dès maintenant.
        </p>
        <button className="cta-button">
          Inscrivez-vous
        </button>
      </section>

      <Footer/>

    </main>
  );
};

export default Home;
