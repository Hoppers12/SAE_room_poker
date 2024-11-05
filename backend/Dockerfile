FROM node:16-alpine

WORKDIR /app

# Copie du package.json et installation des dépendances
COPY package.json package.json
RUN npm install

# Copie de l'application backend
COPY . .

# Expose les ports
EXPOSE 3000
EXPOSE 5000

# Commande de démarrage
CMD ["node", "app.js"]
