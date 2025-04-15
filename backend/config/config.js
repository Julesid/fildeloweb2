// config.js
require('dotenv').config();

module.exports = {
    DB_NAME: process.env.DB_NAME || 'default_db_name',
    DB_USER: process.env.DB_USER || 'default_user',
    DB_PASSWORD: process.env.DB_PASSWORD || 'default_password',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 3306,
    DB_DIALECT: process.env.DB_DIALECT || 'mysql',
};
