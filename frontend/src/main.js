import { createApp } from 'vue';
import App from './views/App.vue';
import router from './router';
const app = createApp(App);

// Importer Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Importer Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
app.use(router);
app.mount('#app');
