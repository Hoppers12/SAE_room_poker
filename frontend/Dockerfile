FROM node:16-alpine

WORKDIR /app

# Copie du package.json et installation des dépendances
COPY package.json package.json
RUN npm install

# Copie du contenu de l'application frontend
COPY . .

# Expose le port pour le frontend
EXPOSE 8000

# Commande de démarrage du frontend
CMD ["npm", "run", "serve"]
