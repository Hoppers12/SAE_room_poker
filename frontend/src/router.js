import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Bet from './views/Bet.vue';
import Game from './views/Game.vue'
import SignUp from './views/SignUp.vue';
import LogIn from "@/views/LogIn.vue";
import AdminAccount from "@/views/Admin/Account.vue";
import AdminBet from "@/views/Admin/AdminBet.vue";

const routes = [
    ...['/','/HomePage','/accueil', '/maison'].map(path => ({ path, component: Home })),
    {
        path: '/bet',
        name: 'Bet',
        component: Bet,
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
    },
    {
        path: '/Admin/Account',
        name: 'AdminAccount',
        component: AdminAccount,
    },
    {
        path: '/Admin/AdminBet',
        name: 'AdminBet',
        component: AdminBet,
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
