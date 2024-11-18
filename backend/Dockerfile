FROM node:16-alpine

# Définit le répertoire de travail
WORKDIR /app

# Copie uniquement les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copie le reste du code de l'application
COPY . .

# Expose les ports nécessaires
EXPOSE 3000
EXPOSE 5000

# Commande par défaut pour démarrer l'application
CMD ["node", "app.js"]
