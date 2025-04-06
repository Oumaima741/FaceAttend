const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql");


// Configuration CORS précise
const corsOptions = {
  origin: 'http://localhost:3000', // Autorise uniquement votre frontend
  credentials: true, // Important pour les requêtes avec credentials
  optionsSuccessStatus: 200 // Pour les navigateurs anciens
};

// Appliquez CORS à toutes les routes
app.use(cors(corsOptions));

// Gestion explicite des requêtes OPTIONS (preflight)
app.options('*', cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());


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

// Get all student images
app.get("/api/getAllImages", (req, res) => {
  const sql = "SELECT id, photo FROM students WHERE photo IS NOT NULL AND photo != ''";
  
  req.db.query(sql, (err, results) => {  // Changed from db.query to req.db.query
    if (err) {
      console.error("Error fetching student images:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const validStudents = results.map(student => {
      // Ensure the photo has proper base64 prefix
      let photo = student.photo;
      if (!photo.startsWith('data:image/')) {
        photo = `data:image/jpeg;base64,${photo}`;
      }
      return { ...student, photo };
    });

    res.json(validStudents);
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
