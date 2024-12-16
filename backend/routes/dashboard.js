const express = require("express");
const router = express.Router();
const Cookies = require("cookies"); // Assurez-vous d'avoir installé ce package : npm install cookies
const Activite = require("../models/Activite");
const session = require("express-session");

// Middleware de session
router.use(
  session({
    secret: "hfgkqjdhfgkjsdgfkjdfgqskjfgkjfhgsdqkjfg",
    resave: false,
    saveUninitialized: false,
  })
);

// Middleware de journalisation des requêtes (optionnel)
/* router.use((req, res, next) => {
  console.log("Requête reçue :", req.method, req.url);
  console.log("Session actuelle :", req.session);
  next();
}); */

// Route : Accès au Dashboard
router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Récupération du token depuis l'en-tête Authorization

    console.log("Token session : ", req.session.token);
    console.log("Session actuelle dashboard.js :", req.session);
    console.log("Token reçu : ", token);

    if (!token || req.session.token !== token) {
      //console.log("Token invalide ou absent :", token);
      return res.status(401).json({ message: "Accès non autorisé" });
    }

    console.log("Token valide :", token);
    res.json({ message: "Données du Dashboard" });
  } catch (error) {
    console.error("Erreur lors de l'accès au Dashboard :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

// Route : Récupération des activités
router.get("/activite", async (req, res) => {
  try {
    const activites = await Activite.findAll();

    if (activites && activites.length > 0) {
      return res.json(activites);
    }

    console.log("Aucune activité trouvée. Envoi des données par défaut.");
    res.json(getDefaultActivites());
  } catch (error) {
    console.error("Erreur lors de la récupération des activités :", error);
    res.status(500).json(getDefaultActivites());
  }
});

// Route : Ajout d'une nouvelle activité
router.post("/activitepost", async (req, res) => {
  try {
    const cookies = new Cookies(req, res);
    const username = cookies.get("usernameId"); // Récupération de l'utilisateur via les cookies

    if (!username) {
      console.log("Utilisateur non authentifié : cookie absent.");
      return res.status(401).json({ error: "Utilisateur non authentifié." });
    }

    const { libelle, commentaire } = req.body;

    if (!libelle) {
      return res.status(400).json({ error: "Le champ 'libelle' est requis." });
    }

    const newActivite = await Activite.create({
      libelle,
      commentaire,
      created_by: username,
    });

    console.log("Nouvelle activité ajoutée :", newActivite);
    res.status(201).json(newActivite);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'activité :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'activité." });
  }
});

// Fonction utilitaire pour les activités par défaut
function getDefaultActivites() {
  return [
    { id: 1, libelle: "Activité 1", commentaire: "Commentaire 1" },
    { id: 2, libelle: "Activité 2", commentaire: "Commentaire 2" },
    { id: 3, libelle: "Activité 3", commentaire: "Commentaire 3" },
  ];
}

module.exports = router;
