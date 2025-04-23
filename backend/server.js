const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();


const corsOptions = {
  origin: 'http://localhost:3000', 
  credentials: true, 
  optionsSuccessStatus: 200 
};


app.use(cors(corsOptions));

app.options('*', cors(corsOptions));


app.options('*', cors(corsOptions));

app.use(express.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", 
  database: "attendance_db"
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
    return;
  }
  console.log("✅ Connecté à la base de données MySQL");
});


app.post("/students", (req, res) => {
  const { id, name, email, filiere, niveau, photo } = req.body;

  const sql = "INSERT INTO students (id, name, email, filiere, niveau, photo) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [id, name, email, filiere, niveau, photo], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout de l'étudiant :", err);
      return res.status(500).send("Erreur d'enregistrement de l'étudiant");
    }
    res.status(201).send("Étudiant enregistré avec succès");
  });
});


app.post("/presence", (req, res) => {
  const { student_id, date, status } = req.body;

  const sql = "INSERT INTO presence (student_id, date, status) VALUES (?, ?, ?)";
  db.query(sql, [student_id, date, status], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout de la présence :", err);
      return res.status(500).send("Erreur d'enregistrement de la présence");
    }
    res.status(201).send("Présence enregistrée avec succès");
  });
});

app.get("/api/getAllImages", (req, res) => {
  const sql = "SELECT id, photo FROM students WHERE photo IS NOT NULL AND photo != ''";
  
  db.query(sql, (err, results) => { 
    if (err) {
      console.error("Error fetching student images:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const validStudents = results.map(student => {
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

  app.post("/api/updatePresence", async (req, res) => {
    const { student_id, status} = req.body;
  
    try {
      const result = db.query(
        `UPDATE presence SET status = ? WHERE student_id = ? `,
        [status, student_id]
      );
      
      res.json({ success: true, affectedRows: result.affectedRows });
    } catch (error) {
      console.error("Erreur SQL:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get('/checkPresence', async (req, res) => {
    try {
      const { student_id } = req.query;
      
      const today = new Date().toISOString().split('T')[0];
      const existingPresence = await Presence.findOne({ 
        where: { 
          student_id,
          date: today
        }
      });
  
      res.json({ alreadyPresent: !!existingPresence });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
app.listen(5000, () => {
  console.log("🚀 Serveur démarré sur http://localhost:5000");
});
const bcrypt = require("bcrypt");

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

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
