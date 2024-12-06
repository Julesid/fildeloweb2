const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const bcrypt = require("bcrypt");
const Epreuve = require("../models/Epreuve");
const Promotion = require("../models/Promotion");
const Utilisateur = require("../models/Utilisateur");
const UtilisateurPromo = require("../models/UtilisateurPromo");

// Middleware pour la gestion des sessions
const session = require("express-session");
router.use(
  session({ secret: "hfgkqjdhfgkjsdgfkjdfgqskjfgkjfhgsdqkjfg", resave: false, saveUninitialized: true })
);
router.use((req, res, next) => {
  console.log("Session actuelle auth.js :", req.session);
  next();
});


router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const utilisateur = await Utilisateur.findByPk(username);

    if (!utilisateur) {
      return res.status(401).json({
        success: false,
        message: "Nom d'utilisateur incorrect.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      utilisateur.mdp_bcrypt
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Mot de passe incorrect.",
      });
    }

    // Génération et stockage du token
    const sessionToken = crypto.randomBytes(16).toString("hex");
    req.session.token = sessionToken; // Stocke le token dans la session
    req.session.username = utilisateur.nom; // Stocke également le nom de l'utilisateur

    // Sauvegarde explicite de la session pour s'assurer qu'elle est enregistrée
    req.session.save((err) => {
      if (err) {
        console.error("Erreur lors de la sauvegarde de la session :", err);
        return res
          .status(500)
          .json({ success: false, message: "Erreur du serveur." });
      }

      // Réponse avec le token et les informations utilisateur
      res.json({
        success: true,
        message: "Connexion réussie !",
        sessionToken,
        user: utilisateur.nom,
      });
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({
      success: false,
      message: "Erreur du serveur.",
    });
  }
});

// Route pour déconnexion
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Déconnexion réussie." });
  });
});

// Route pour récupérer les epreuves depuis la base de données
router.get("/epreuve", async (req, res) => {
  try {
    // Tente de récupérer les epreuves depuis la base de données
    const epreuves = await Epreuve.findAll();

    // Si des epreuves sont récupérées, les envoyer au frontend
    if (epreuves && epreuves.length > 0) {
      res.json(epreuves);
    } else {
      // Si aucune epreuve n'est trouvée, renvoyer des epreuves par défaut
      const defaultEpreuves = [
        { id: 1, label: "Epreuve 1" },
        { id: 2, label: "Epreuve 2" },
        { id: 3, label: "Epreuve 3" },
      ];
      res.json(defaultEpreuves);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des epreuves :", error);

    // En cas d'erreur, renvoyer des epreuves par défaut
    const defaultEpreuves = [
      { id: 1, label: "Epreuve 1" },
      { id: 2, label: "Epreuve 2" },
      { id: 3, label: "Epreuve 3" },
    ];
    res.json(defaultEpreuves);
  }
});

router.get("/promotion", async (req, res) => {
  try {
    // Tente de récupérer les enseignant depuis la base de données
    const promotions = await Promotion.findAll();

    // Si des enseignant sont récupérées, les envoyer au frontend
    if (promotions && promotions.length > 0) {
      res.json(promotions);
    } else {
      // Si aucune enseignant n'est trouvée, renvoyer des enseignant par défaut
      const defaultPromotions = [
        { id: 1, label: "Promotions 1" },
        { id: 2, label: "Promotions 2" },
        { id: 3, label: "Promotions 3" },
      ];
      res.json(defaultPromotions);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des romotions :", error);

    // En cas d'erreur, renvoyer des enseignant par défaut
    const defaultPromotions = [
      { id: 1, label: "Promotions 1" },
      { id: 2, label: "Promotions 2" },
      { id: 3, label: "Promotions 3" },
    ];
    res.json(defaultPromotions);
  }
});

// Route pour récupérer les utilisateurs depuis la base de données
router.get("/utilisateur", async (req, res) => {
  try {
    // Tente de récupérer les enseignant depuis la base de données
    const utilisateurs = await Utilisateur.findAll();

    // Si des enseignant sont récupérées, les envoyer au frontend
    if (utilisateurs && utilisateurs.length > 0) {
      res.json(utilisateurs);
    } else {
      // Si aucune enseignant n'est trouvée, renvoyer des enseignant par défaut
      const defaultUtilisateurs = [
        { id: 1, label: "Utilisateurs 1" },
        { id: 2, label: "Utilisateurs 2" },
        { id: 3, label: "Utilisateurs 3" },
      ];
      res.json(defaultUtilisateurs);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);

    // En cas d'erreur, renvoyer des enseignant par défaut
    const defaultUtilisateurs = [
      { id: 1, label: "Utilisateurs 1" },
      { id: 2, label: "Utilisateurs 2" },
      { id: 3, label: "Utilisateurs 3" },
    ];
    res.json(defaultUtilisateurs);
  }
});

// Route pour récupérer les promotions associées à un utilisateur donné
router.get("/promotion/:utilisateur_id", async (req, res) => {
  const { utilisateur_id } = req.params;

  try {
    // Récupère les promotions associées à l'utilisateur via la table UtilisateurPromo
    const promotions = await Promotion.findAll({
      include: {
        model: UtilisateurPromo,
        where: { utilisateur_id: utilisateur_id },
      },
    });

    if (promotions.length > 0) {
      res.json(promotions);
    } else {
      res.json({ message: "Aucune promotion trouvée pour cet utilisateur." });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des promotions :", error);
    res.status(500).json({ message: "Erreur du serveur." });
  }
});

module.exports = router;
