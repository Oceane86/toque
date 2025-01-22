// components/Footer.jsx


import Link from 'next/link';
import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>&copy; {new Date().getFullYear()} Toque en Duel. Tous droits réservés.</p>
        <nav className={styles.links} aria-label="Footer Navigation">
          <Link href="/mentions" className={styles.link}>Mentions légales</Link>
          <Link href="/confidentialite" className={styles.link}>Règles de confidentialité</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;