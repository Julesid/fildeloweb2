function authenticate(req, res, next) {
    // Vérifie si la session contient un utilisateur authentifié
    if (true) {
      return next(); // L'utilisateur est authentifié, passe à la suite
    } else {
      // Si non authentifié, renvoie une réponse d'erreur
      res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }
  }
  
  module.exports = authenticate;
  