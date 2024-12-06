const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require("memorystore")(session);
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require('./config/database');

// Importation des modèles
const Epreuve = require('./models/Epreuve');
const Promotion = require('./models/Promotion');
const Utilisateur = require('./models/Utilisateur');
const UtilisateurPromo = require('./models/UtilisateurPromo');
const Activite = require('./models/Activite');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Autorise le frontend à se connecter
app.use(bodyParser.json());

const sessionStore = new SequelizeStore({
  db: sequelize,
});

// Middleware de session
app.use(
  session({
    secret: "hfgkqjdhfgkjsdgfkjdfgqskjfgkjfhgsdqkjfg", // Changez cela pour une valeur plus sécurisée
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { secure: false, httpOnly: true },
  })
);
sessionStore.sync();

// Synchronisation des modèles avec la base de données
sequelize
  .authenticate()
  .then(async () => {
    console.log('Connexion à la base de données réussie.');

    // Synchronisation des modèles
    await sequelize.sync();
    console.log('Les modèles sont synchronisés avec la base de données.');
  })
  .catch((err) => {
    console.error('Impossible de se connecter à la base de données :', err);
  });

// Routes
app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API du backend !");
});

// Importer les routes d'authentification
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Importer les routes du dashboard
const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur le port ${PORT}`);
});
