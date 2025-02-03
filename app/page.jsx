// app/page.jsx

"use client";
import '../styles/globals.css';
import Navbar from '@components/NavBar';
import Footer from '@components/Footer';
import Head from 'next/head';
import Link from 'next/link';

const Home = () => {
  return (
    <main className="main-container">
      <Navbar />

      <Head>
        <title>Toque en duel - Découvrez des recettes culinaires et des défis passionnants</title>
        <meta name="description" content="Toque en duel vous offre une expérience unique avec des recettes hebdomadaires, des défis culinaires guidés par l'intelligence artificielle et un moyen amusant de partager vos créations." />
        <meta name="keywords" content="recettes, défis culinaires, IA, cuisine, apprendre à cuisiner, défis de cuisine, partager ses recettes, cuisine innovante" />
        <meta name="author" content="Toque en duel" />
      </Head>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">
          Bienvenue sur <span className="highlight">Toque en duel</span>
        </h1>
        <p className="hero-description">
          Découvrez une nouvelle façon de simplifier votre quotidien, d'apprendre de nouvelles recettes et de vous lancer des défis passionnants, avec l'aide de l'intelligence artificielle.
        </p>
        <Link href="/culinary">
          <button className="hero-button">
            En savoir plus
          </button>
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2 className="features-title">
          Pourquoi choisir Toque en duel ?
        </h2>
        <div className="features-cards">
          <div className="feature-card">
            <h3 className="feature-title">Apprenez de nouvelles recettes</h3>
            <p className="feature-description">
              Apprenez à cuisiner des recettes variées adaptées à tous les niveaux, allant des plats traditionnels aux créations modernes.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Défis hebdomadaires avec l'IA</h3>
            <p className="feature-description">
              Participez à des défis culinaires uniques chaque semaine, guidés par l'intelligence artificielle pour vous aider à progresser.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Montrez vos créations</h3>
            <p className="feature-description">
              Partagez vos plats et créations avec la communauté pour inspirer et être inspiré par d'autres passionnés de cuisine.
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
          Créez votre compte, relevez des défis culinaires innovants et améliorez vos compétences en cuisine avec Toque en duel. Rejoignez une communauté dynamique et passionnée.
        </p>
        <Link href="/register">
          <button className="cta-button">
            Inscrivez-vous
          </button>
        </Link>
      </section>

      <Footer />
    </main>
  );
};

export default Home;
