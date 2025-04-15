# Étape 1 : Build du frontend
FROM node:20-alpine AS build-frontend

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Étape 2 : Préparer le backend
FROM node:20-alpine

WORKDIR /app

# Copier le backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copier le backend et le build du frontend
COPY backend ./backend
COPY --from=build-frontend /app/frontend/build ./backend/public

# Port par défaut
EXPOSE 5001
EXPOSE 3000

# Lancer le serveur (supposons que server.js est dans /backend)
WORKDIR /app/backend
CMD ["node", "app.js"]