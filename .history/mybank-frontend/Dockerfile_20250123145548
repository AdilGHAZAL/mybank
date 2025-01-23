# Étape 1: Utiliser une image de base Node.js
FROM node:18 AS build

# Étape 2: Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3: Copier les fichiers de configuration du projet
COPY package.json yarn.lock* ./

# Étape 4: Installer les dépendances
RUN yarn install

# Étape 5: Copier le reste des fichiers du projet
COPY . .

# Étape 6: Construire l'application React
RUN yarn build

# Étape 7: Utiliser une image légère pour servir l'application
FROM nginx:alpine

# Étape 8: Copier les fichiers construits dans le conteneur Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Étape 9: Exposer le port 80
EXPOSE 80

# Étape 10: Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]