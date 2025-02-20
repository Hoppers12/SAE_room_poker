import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Bet from './views/Bet.vue';
import Game from './views/Game2.vue'
import SignUp from './views/SignUp.vue';
import LogIn from "@/views/LogIn.vue";
import AdminAccount from "@/views/Admin/Account.vue";
import AdminBet from "@/views/Admin/AdminBet.vue";
import Profile from "@/views/Profile.vue";
import BetResume from "@/views/BetResume.vue";
import AdminMatch from "@/views/Admin/AdminMatch.vue";
import LobbyChoice from "./components/LobbyChoice.vue";
import Game1  from './views/Game1.vue';
import Game2 from './views/Game2.vue';
import Game3 from './views/Game3.vue';

const routes = [
    ...['/','/HomePage','/accueil', '/maison'].map(path => ({ path, component: Home })),
    {
        path: '/bet',
        name: 'Bet',
        component: Bet,
    },
    {
      path: '/admin/adminmatch', name: 'AdminMatch', component: AdminMatch,
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
        path: '/game1',
        name: 'game1',
        component: Game1,
    },
    {
        path: '/game2',
        name: 'game2',
        component: Game2,
    },
    {
        path: '/game3',
        name: 'game3',
        component: Game3,
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
    },
    {
        path: '/lobby',
        name:'Lobby',
        component: LobbyChoice,
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
