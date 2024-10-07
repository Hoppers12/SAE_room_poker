import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Game from './views/Game.vue'

const routes = [
    ...['/','/HomePage','/accueil', '/maison'].map(path => ({ path, component: Home })),
    {
        path: '/about',
        name: 'About',
        component: About,
    },
        ...['/game','/play', '/start','/jouer','/jeu'].map(path => ({ path, component: Game })),
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
