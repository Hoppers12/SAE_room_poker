FROM node:16-alpine

# Définit le répertoire de travail
WORKDIR /app

# Copie uniquement package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./

# Installe les dépendances uniquement si package.json ou package-lock.json ont changé
RUN npm install

# Copie le reste du code de l'application (le plus tard possible pour maximiser l'utilisation du cache)
COPY . .

# Expose les ports nécessaires
EXPOSE 3000
EXPOSE 5000

# Commande par défaut pour démarrer l'application
CMD ["node", "app.js"]
