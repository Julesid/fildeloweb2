const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const Activite = require('../models/Activite');
const Cookies = require('cookies'); // Assurez-vous d'avoir installé ce package : npm install cookies



router.get("/api/dashboard", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token || !isValidToken(token)) {
    return res.status(401).json({ message: "Accès non autorisé" });
  }

  // Si le token est valide, retourne les données du dashboard
  res.json({ message: "Données du Dashboard" });
});

function isValidToken(token) {
  // Vérification du token (par exemple, en utilisant une session stockée en backend)
  return token === "valid-session-token";
}

router.get("/activite", async (req, res) => {
  try {
    // Tente de récupérer les activités depuis la base de données
    const activites = await Activite.findAll();

    // Si des activités sont récupérées, les envoyer au frontend
    if (activites && activites.length > 0) {
      res.json(activites);
    } else {
      console.log("Pas d'activité");
      // Si aucune activité n'est trouvée, renvoyer des activités par défaut
      const defaultActivites = [
        { id: 1, libelle: "Activité 1", commentaire: "Commentaire 1" },
        { id: 2, libelle: "Activité 2", commentaire: "Commentaire 2" },
        { id: 3, libelle: "Activité 3", commentaire: "Commentaire 3" },
      ];
      res.json(defaultActivites);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des activités :", error);
    //console.log("Pas d'activité");
    // En cas d'erreur, renvoyer des activités par défaut
    const defaultActivites = [
      { id: 1, libelle: "Activité 1", commentaire: "Commentaire 1" },
      { id: 2, libelle: "Activité 2", commentaire: "Commentaire 2" },
      { id: 3, libelle: "Activité 3", commentaire: "Commentaire 3" },
    ];
    res.json(defaultActivites);
  }
});

router.post("/activitepost", async (req, res) => {
  try {
    const cookies = new Cookies(req, res);
    const username = cookies.get("username"); // Récupérer la valeur du cookie

    const { libelle, commentaire } = req.body;

    if (!libelle) {
      return res.status(400).json({ error: "Le champ 'libelle' est requis." });
    }

    if (!username) {
      return res.status(400).json({ error: "Utilisateur non authentifié." });
    }

    const newActivite = await Activite.create({
      libelle,
      commentaire,
      created_by: username, // Associe l'utilisateur au champ created_by
    });

    res.status(201).json(newActivite);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'activité :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'activité." });
  }
});


module.exports = router;

