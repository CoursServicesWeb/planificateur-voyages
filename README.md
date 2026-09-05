# TP1 et TP2 - Services Web

# Application de planification de voyages

### Étudiants : Jean-François Pierre, Nadjib Ammour et Amit Chandel

## Présentation

Dans ce projet de création d'une application de voyages, nous avons d'abord créé toute la structure en backend pour créer des routes qui permettent de faire le CRUD des utilsateurs de la platerformes, des destinations de voyages, des voyages contenant plusieurs étapes dans diverses villes, des avis sur les destinations, ainsi que la gestion des authentifications et des autorisations de l'application.

Ensuite, lors du TP2, nous avons créé un frontend avec React qui permet à un utilisateur de naviguer à travers des pages d'accueil (avec affichage détaillé des destinations et des avis sur chaque destination), une page de connexion, une page d'inscription et une page pour créer et modifier des voyages et des étapes de voyages. Nous avons aussi une page Administrateur, accessible seulement par ceux qui ont le Role Admin, qui permet de créer, modifier et supprimer des destinations, ainsi que de supprimer les infos sur des pays.

![Image](images\Capture_d’écran_2026-09-04_214024.png)

## Comment activer l'application

#### Ouvrez un éditeur de code et entrez la commande suivante dans le terminal :

git clone https://github.com/CoursServicesWeb/planificateur-voyages.git

#### Ensuite, assurez-vous d'avoir les plateformes Node.js et Vite.js d'installées sur votre ordinateur, et de posséder un compte sur Néon. Entrez ensuite les commandes suivantes :

- cd backend
- npm install

#### Ouvrez un deuxième terminal et entrez les commandes suivantes :

- cd ../frontend
- npm install

#### Puis, créez deux fichiers .env (un en backend et un en frontend) et remplacez les variables des fichiers .env.examples par de vraies variables d'environnement. (Le DATABASE URL correspond à celui de votre base pour le projet sur Néon)

#### Pour la variable JWT_SECRET, entrez la commande suivante dans le terminal :

- node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

#### Copiez la châine de caractères générée et insérez-là dans la variable appelée JWT_SECRET dans .env. Après, exécutez les commandes ci-dessous :

En backend :

- npx prisma migrate dev --name init
- npx prisma generate
- npm run seed
- npm run dev

En frontend :

- npm run dev

#### Le serveur (sur votre localhost:5173) est maintenant prêt à afficher l'application Web.

## Objectifs du projet :

- Apprendre à manipuler une base de données PostgreSQL (hébergée sur Neon) en utilisant Prisma.
- Se familiariser avec le framework express pour gérer les routes et les requêtes HTTP dans un serveur.
- Se servir de la librairie axios pour appeler des API externes.
- Apprendre à gérer le "hashage" des mots de passe avec bcrypt, ainsi que les authentifications et les autorisations avec JWT.
- Créer des routes et des fonctions pour gérer tout le CRUD des différentes tables d'une base de données.
- Apprendre à manipuler React pour un frontend de page Web dynamique qui communique avec le backend.

## Outils requis pour le projet :

- Node.js
- Neon
- Vite.js

## Fonctionnalités de l'application :

- CRUD des différentes destinations de voyage, ainsi que des informations sur le pays dans lequel elles sont situées.
- CRUD des comptes utilisateurs et gestion des authentifications et des autorisations.
- CRUD de voyages avec plusieurs étapes dans différentes destinations, et affichage de la météo pour ces étapes (à venir pour la météo).
- CRUD des avis des voyageurs sur les destinations qu'ils ont visité.
- Affichage des destinations filtrées par continent.
- Calcul de la note moyenne des avis laissés par les utilsateurs.

![Image](images\Capture_d’écran_2026-09-04_215011.png)

## Liste des routes implémentées :

- auth
- voyages
- etapes
- destinations
- api/pays
- avis
