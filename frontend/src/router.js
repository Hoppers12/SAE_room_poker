import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Bet from './views/Bet.vue';
import Game from './views/Game.vue'
import SignUp from './views/SignUp.vue';
import LogIn from "@/views/LogIn.vue";
import AdminAccount from "@/views/Admin/Account.vue";
import AdminBet from "@/views/Admin/AdminBet.vue";
import Profile from "@/views/Profile.vue";
import BetResume from "@/views/BetResume.vue";
const routes = [
    ...['/','/HomePage','/accueil', '/maison'].map(path => ({ path, component: Home })),
    {
        path: '/bet',
        name: 'Bet',
        component: Bet,
    },
        ...['/game','/play', '/start','/jouer','/jeu'].map(path => ({ path, component: Game })),
    {
        path: '/signup',
        name: 'signup',
        component: SignUp,
    },
    {
        path: '/login',
        name: 'login',
        component: LogIn,
    },
    {
        path: '/admin/account',
        name: 'AdminAccount',
        component: AdminAccount,
    },
    {
        path: '/betresume',
        name: 'BetResume',
        component: BetResume,
    },
    {
        path: '/admin/adminbet',
        name: 'AdminBet',
        component: AdminBet,
    },
    {
        path: '/profile',
        name:'Profile',
        component: Profile,
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
