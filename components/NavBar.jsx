// appp/components/Navbar.jsx


import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Navbar.module.css';
import Image from 'next/image'; 

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <Image src="/images/icone_toque_en_duel.svg" alt="Logo" width={150} height={50} />
        </div>

        {/* Hamburger Menu */}
        <button onClick={toggleMenu} className={styles.hamburger} aria-label="Toggle menu">
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        {/* Desktop Menu */}
        <ul className={styles.desktopMenu}>
          <li><a href="/" className={styles.menuItem}>Accueil</a></li>
          <li><a href="/culinary" className={styles.menuItem}>Découvrez de nouvelles recettes</a></li>
          <li><a href="/challenges" className={styles.menuItem}>Challenges</a></li>
          <li><a href="/login" className={styles.menuItem}>Login</a></li>
          <li><a href="/register" className={styles.button}>S'inscrire</a></li>
        </ul>
      </div>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
            <div className={styles.logoContainer}> 
                <div className={styles.logoMobile}>
                    <Image src="/images/icone.svg" alt="Logo" width={120} height={100} />
                </div>
            </div>
            {/* Close Button */}
            <button onClick={toggleMenu} className={styles.closeButton} aria-label="Close menu">
                <FontAwesomeIcon icon={faTimes} />
            </button>

            <ul className={styles.menu}>
            <li><a href="/" className={styles.menuItem}>Accueil</a></li>
            <li><a href="/culinary" className={styles.menuItem}>Découvrez de nouvelles recettes</a></li>
            <li><a href="/challenges" className={styles.menuItem}>Challenges</a></li>
            <li><a href="/login" className={styles.menuItem}>Login</a></li>
            <li><a href="/register" className={styles.button}>S'inscrire</a></li>
            </ul>
        </div>
    </nav>
  );
};

export default Navbar;