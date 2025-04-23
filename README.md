# 📸 FaceAttend – Système de Reconnaissance Faciale pour la Gestion de Présence

## 📜 Description du projet

**FaceAttend** est une solution intelligente de gestion de la présence basée sur la reconnaissance faciale en temps réel. Ce projet vise à automatiser le suivi de présence dans un établissement scolaire ou une entreprise en utilisant la détection et la reconnaissance de visages via webcam.

### l'objectif est de :
- Éviter la fraude liée aux feuilles de présence manuelles.
- Gagner du temps et simplifier le processus d’enregistrement.
- Générer des rapports fiables et consultables à tout moment.

L'application repose sur un backend Node.js connecté à une base de données MySQL, et une interface utilisateur développée avec React.js.

---

## 🧑‍💻 Membres de l’équipe

- **Oumaima Kaadade**
- **ouissal hacob**

---

## 🧰 Technologies utilisées

- **React.js** – Interface utilisateur
- **Node.js / Express.js** – Backend
- **MySQL** – Base de données
- **OpenCV / face-api.js** – Reconnaissance faciale
- **Axios** – Communication client-serveur
- **Git & GitHub** – Versioning

---

## 🏗️ Structure du projet

```bash
├── backend
│   └── server.js          # API Express
│   └── package.json
├── frontend
│   └── src
│       ├── assets/images  # Photos des étudiants
│       ├── components     # Composants UI (Camera, Table, etc.)
│       ├── pages          # Pages (Login, Dashboard, Attendance)
│       ├── App.js
│       └── index.js
├── public
├── README.md
# Modèles de données
└── README.md
```
## 🚀 Lancer le projet localement
1. Cloner le dépôt
```
git clone https://github.com/votre-utilisateur/faceattend.git
```

2. Installer les dépendances
Frontend
```
cd ../frontend
npm install
```
Backend :
```
cd ../backend
npm install
```
## 3. Démarrer le projet

### Terminal 1 (backend)
```
cd backend
node server.js 
```
### Terminal 2 (frontend)
```
cd frontend
npm start
```
## 👨‍👩‍👧‍👦 Parcours utilisateur

### - Accueil : Mise en avant des fonctionnalités clés + vision du projet

### - Inscription : Formulaire simple pour créer un compte utilisateur

### - Connexion : Redirection automatique après inscription

### - Interface principale :

 ### Sidebar intuitive pour naviguer entre :
  
  - Page d’aide : infos d’utilisation et contact support .
  
  - Gestion des étudiants .
  
  - Détection faciale .
  
  - Dashboard statistique .


## 🔍 Fonctionnalités

👤 Gestion des étudiants
Ajouter, modifier, supprimer étudiants

Enregistrement automatique dans la base de données

🎥 Reconnaissance faciale
Chargement des modèles face-api.js

Détection en temps réel via webcam

Marquage automatique de présence si correspondance

📊 Tableau de bord dynamique
Vue d’ensemble des présences, absences, retards

Détail hebdomadaire par étudiant

Filtres par filière et niveau

🆘 Aide & support
Page dédiée avec explications et contact support

## 📦 Versions utilisées
```
{
  "react": "^18.x",
  "express": "^4.x",
  "mysql2": "^3.x",
  "face-api.js": "^0.22.2",
  "axios": "^1.x"
}
```

## 🧪 Défis techniques & solutions

Performance de détection en direct	Utilisation de face-api.js avec des modèles allégés
Problème de caméra non détectée	Gestion des permissions navigateur
Détection multiple par erreur	Ajout d’un seuil de distance faciale
##🐞 Bugs connus
📷 Si plusieurs visages apparaissent dans la même frame, un mauvais mapping peut survenir.

### 🔁 En cas de rafraîchissement fréquent, le modèle facial peut être ralenti temporairement.

### 🧩 Astuce : Gestion des versions de Node
Si tu rencontres un problème d’incompatibilité avec npm run dev, installe une version compatible avec nvm :


### Si nvm n’est pas reconnu
### Télécharge-le :
https://github.com/coreybutler/nvm-windows/releases
### Puis relance ton terminal et fais :
```
nvm install 18.17.0
nvm use 18.17.0
node -v  # doit afficher v18.17.0
```


## 🔗 Liens utiles
[ Présentation ](https://www.canva.com/design/DAGkmEx47I4/e9Ec03jDXiKu4SQH8jU66g/watch?utm_content=DAGkmEx47I4&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h90a265df78 )


