const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// Connexion à MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // change si nécessaire
  database: "attendance_db"
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
    return;
  }
  console.log("✅ Connecté à la base de données MySQL");
});

// Route pour ajouter un étudiant
app.post("/students", (req, res) => {
    const { id, name, filiere, niveau, email, photo } = req.body;
    const sql = "INSERT INTO students (id, name, filiere, niveau, email, photo) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [id, name, filiere, niveau, email, photo], (err, result) => {
      if (err) {
        console.error("❌ Erreur lors de l'insertion :", err);
        return res.status(500).send("Erreur serveur");
      }
      res.status(200).send("Étudiant ajouté !");
    });
  });
  
app.get("/students", (req, res) => {
    const sql = "SELECT * FROM students";
    db.query(sql, (err, results) => {
      if (err) {
        console.error("❌ Erreur lors de la récupération :", err);
        return res.status(500).send("Erreur serveur");
      }
      res.status(200).json(results);
    });
  });
  app.delete("/students/:id", (req, res) => {
    const studentId = req.params.id;
    const sql = "DELETE FROM students WHERE id = ?";
    db.query(sql, [studentId], (err, result) => {
      if (err) {
        console.error("❌ Erreur lors de la suppression :", err);
        return res.status(500).send("Erreur serveur");
      }
      res.status(200).send("Étudiant supprimé !");
    });
  });
  
// Lancer le serveur
app.listen(5000, () => {
  console.log("🚀 Serveur démarré sur http://localhost:5000");
});
const bcrypt = require("bcrypt");

// Signup route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // Regex pour mot de passe fort (min 8 caractères, 1 maj, 1 min, 1 chiffre, 1 spé)
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!strongPassword.test(password)) {
    return res.status(400).send("Le mot de passe n’est pas assez fort.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      console.error("❌ Erreur lors de l’inscription :", err);
      return res.status(500).send("Erreur lors de l’inscription.");
    }
    res.status(200).send("Utilisateur inscrit !");
  });
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).send("Erreur serveur");
    if (results.length === 0) return res.status(401).send("Utilisateur non trouvé");

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).send("Mot de passe incorrect");
    }

    res.status(200).send("Connexion réussie !");
  });
});
