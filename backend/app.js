const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const sequelize = require('./config/database');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Middleware de session
app.use(session({
  secret: 'ton_secret', // Mets ici un secret fort et sécurisé
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Mets `true` si tu utilises HTTPS
}));

// Test de connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie.');
  })
  .catch((err) => {
    console.error('Impossible de se connecter à la base de données :', err);
  });

// Routes
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API du backend !');
});

// Importer les routes d'authentification
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Ajout de la route du Dashboard protégée par authentification
const authenticate = require('./middleware/auth');
app.get('/api/dashboard', authenticate, (req, res) => {
  res.json({ message: 'Bienvenue sur le Dashboard protégé !' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur le port ${PORT}`);
});
