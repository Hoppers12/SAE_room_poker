
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // URL de ton API Express
  timeout: 1000, // Délai d'attente pour les requêtes
});

export default instance;
