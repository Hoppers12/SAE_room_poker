import { createApp } from 'vue';
import App from './views/App.vue';
import router from './router'; // Importer le routeur

const app = createApp(App);
app.use(router); // Utiliser le routeur
app.mount('#app');
