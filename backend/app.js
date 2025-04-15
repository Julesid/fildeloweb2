const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const MemoryStore = require("memorystore")(session); // Alternative pour le stockage en mémoire
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./config/database");

// Importation des modèles
const Epreuve = require("./models/Epreuve");
const Promotion = require("./models/Promotion");
const Utilisateur = require("./models/Utilisateur");
const UtilisateurPromo = require("./models/UtilisateurPromo");
const Activite = require("./models/Activite");

const app = express();
const PORT = 5001;

// --- Middleware ---

// CORS : Autoriser les requêtes provenant du frontend
app.use(
  cors({
    origin: "http://localhost:3000", // URL de ton frontend
    credentials: true, // Permet d'envoyer les cookies et headers d'authentification
  })
);

// Body Parser : Permet de traiter les requêtes JSON
app.use(bodyParser.json());

// Configuration de stockage de session avec Sequelize
const sessionStore = new SequelizeStore({
  db: sequelize,
});

// Configuration globale de la session
app.use(
  session({
    secret: "hfgkqjdhfgkjsdgfkjdfgqskjfgkjfhgsdqkjfg",
    resave: false,
    saveUninitialized: false,
    store: sessionStore, // Utilise Sequelize pour stocker les sessions
    cookie: {
      maxAge: 30 * 60 * 1000, // Durée de vie des cookies : 30 minutes
      httpOnly: true, // Améliore la sécurité en empêchant l'accès aux cookies côté client
      secure: false, // Passe à "true" si HTTPS est utilisé
    },
  })
);

// Synchronisation du store de sessions
sessionStore.sync();

// --- Base de données ---

sequelize
  .authenticate()
  .then(async () => {
    console.log("Connexion à la base de données réussie.");

    // Synchronisation des modèles avec la base de données
    await sequelize.sync();
    console.log("Les modèles sont synchronisés avec la base de données.");
  })
  .catch((err) => {
    console.error("Impossible de se connecter à la base de données :", err);
  });

// --- Routes de l'API ---

// Route de base pour vérifier le fonctionnement de l'API


// Routes d'authentification
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Routes du dashboard
const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
}
);

// --- Lancement du serveur ---

app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur le port ${PORT}`);
});
