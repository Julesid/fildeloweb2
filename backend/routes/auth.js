const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Epreuve = require("../models/Epreuve");
const Promotion = require("../models/Promotion");
const Utilisateur = require("../models/Utilisateur");
const UtilisateurPromo = require("../models/UtilisateurPromo");

// Middleware pour la gestion des sessions
const session = require("express-session");
router.use(
  session({ secret: "ton_secret", resave: false, saveUninitialized: true })
);

// Route de connexion
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Récupère l'utilisateur en utilisant la clé primaire (ici, le nom d'utilisateur)
    const utilisateur = await Utilisateur.findByPk(username);

    if (!utilisateur) {
      // Si l'utilisateur n'est pas trouvé, renvoie une erreur
      return res
        .status(401)
        .json({ message: "Nom d'utilisateur incorrect." });
    }

    // Vérifie le mot de passe haché avec bcrypt
    const isPasswordValid = await bcrypt.compare(
      password,
      utilisateur.mdp_bcrypt
    );

    if (isPasswordValid) {
      // Enregistre l'authentification dans la session
      req.session.isAuthenticated = true;
      return res.json({ message: "Connexion réussie !", success: true });
    } else {
      // Mot de passe incorrect
      return res
        .status(401)
        .json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return res.status(500).json({ message: "Erreur du serveur." });
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
