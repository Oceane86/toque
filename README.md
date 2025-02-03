# Toque Duel

Toque Duel est un site web interactif permettant aux utilisateurs de participer à des défis culinaires en ligne. Les participants peuvent participer à un défi hebdomaire généré par IA.

## Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Usage](#usage)
- [Structure du projet](#structure-du-projet)
- [Technologies utilisées](#technologies-utilisées)

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- Node.js (version 14 ou supérieure)
- MongoDB (local ou via un service cloud comme MongoDB Atlas)
- Git (facultatif, pour cloner le projet)

## Installation

1. Clonez ce repository sur votre machine locale :

   ```bash
   git clone https://github.com/Oceane86/toque_duel.git
   ```

2. Accédez au répertoire du projet :

   ```bash
   cd toque_duel
   ```

3. Installez les dépendances nécessaires :

   ```bash
   npm install
   ```

4. Configurez votre base de données MongoDB en modifiant les variables d’environnement dans le fichier `.env` (ex. : MongoDB URI).

5. Lancez le serveur en mode développement :

   ```bash
   npm run dev
   ```

   Cela lancera le serveur à l'adresse `http://localhost:3000`.

## Usage

Toque Duel permet aux utilisateurs de participer à des défis culinaires. Voici les principales fonctionnalités :

- **Inscription / Connexion** : Créez un compte pour participer aux défis hebdomadaires.
- **Défis** : Participez à des défis et de pouvoir montrer leurs plats/
- **Historique** : Consultez les résultats des anciens défis.


## Technologies utilisées

- **Next.js** : Framework React pour le rendu côté serveur et la génération de pages statiques.
- **MongoDB** : Base de données NoSQL pour stocker les informations des utilisateurs, des recettes et des défis.
- **Mongoose** : ODM (Object Data Modeling) pour interagir avec MongoDB.
- **Node.js** : Environnement d'exécution JavaScript côté serveur.
