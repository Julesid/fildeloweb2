const express = require("express");
const router = express.Router();
const Cookies = require("cookies");
const Activite = require("../models/Activite");
const Utilisateur = require("../models/Utilisateur");
const Etudiant = require("../models/Etudiant");
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
    const token = req.headers.authorization?.split(" ")[1];

    console.log("Token session : ", req.session.token);
    console.log("Session actuelle dashboard.js :", req.session);
    console.log("Token reçu : ", token);

    if (!token || req.session.token !== token) {
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
    const username = cookies.get("usernameId");

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

// Route : Suppression d'une activité
router.delete("/activite/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const activite = await Activite.findByPk(id);

    if (!activite) {
      return res.status(404).json({ message: "Activité non trouvée." });
    }

    await activite.destroy();
    console.log("Activité supprimée :", id);
    res.status(200).json({ message: "Activité supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'activité :", error);
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
});

// Route : Modification d'une activité
router.put("/activite/:id", async (req, res) => {
  const { id } = req.params;
  const { libelle, commentaire } = req.body;

  try {
    // Recherche l'activité par son ID
    const activite = await Activite.findByPk(id);

    if (!activite) {
      return res.status(404).json({ message: "Activité non trouvée." });
    }

    // Met à jour les champs
    activite.libelle = libelle;
    activite.commentaire = commentaire;

    // Sauvegarde les modifications
    await activite.save();

    res.status(200).json(activite);
  } catch (error) {
    console.error("Erreur lors de la modification de l'activité :", error);
    res.status(500).json({ error: "Erreur lors de la modification." });
  }
});

const bcrypt = require("bcrypt");

// Route pour modifier le mot de passe
router.put("/password", async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || req.session.token !== token) {
    return res.status(401).json({ message: "Accès non autorisé" });
  }

  try {
    const username = req.session.username; // Utilisateur actuel depuis la session
    const utilisateur = await Utilisateur.findOne({ where: { nom: username } });

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      utilisateur.mdp_bcrypt
    );

    if (!isOldPasswordValid) {
      return res
        .status(400)
        .json({ message: "Mot de passe actuel incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    utilisateur.mdp_bcrypt = hashedPassword;
    await utilisateur.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// Route : Récupération des étudiants
router.get("/etudiants", async (req, res) => {
  try {
    const etudiants = await Etudiant.findAll();

    if (etudiants.length > 0) {
      return res.json(etudiants);
    }

    console.log("Aucun étudiant trouvé.");
    res.json([]);
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

router.get("/etudiantsFromPromo/:id", async (req, res) => {
  try {
    const etudiants = await Etudiant.findAll();

    if (etudiants.length > 0) {
      return res.json(etudiants);
    }

    console.log("Aucun étudiant trouvé.");
    res.json([]);
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants :", error);
    res.status(500).json({ error: "Erreur serveur." });
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
