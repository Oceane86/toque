// app/challenges/[id]/page.js

import Link from 'next/link';
import styles from './page.module.css'; // Assuming you have a CSS module

export default function ChallengePage({ params }) {
  const { id } = params;
  const decodedId = decodeURIComponent(id);
  const challenge = { title: `Challenge ${decodedId}`, description: `Description du challenge ${decodedId}` };

  if (!decodedId) {
    return <div>Challenge introuvable</div>;
  }

  return (
    <div>
      <h1 className={styles.title}>{challenge.title}</h1>
      <p className={styles.description}>{challenge.description}</p>
      <Link href="/challenges" className={styles.link}>
        Retour à la liste des challenges
      </Link>
    </div>
  );
}
