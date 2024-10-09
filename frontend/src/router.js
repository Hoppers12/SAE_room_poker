import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Game from './views/Game.vue'
import SignUp from './views/SignUp.vue';
import LogIn from "@/views/LogIn.vue";

const routes = [
    ...['/','/HomePage','/accueil', '/maison'].map(path => ({ path, component: Home })),
    {
        path: '/about',
        name: 'About',
        component: About,
    },
        ...['/game','/play', '/start','/jouer','/jeu'].map(path => ({ path, component: Game })),
    {
        path: '/SignUp',
        name: 'signup',
        component: SignUp,
    },
    {
        path: '/LogIn',
        name: 'login',
        component: LogIn,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
