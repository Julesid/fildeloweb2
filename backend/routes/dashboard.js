const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');

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

