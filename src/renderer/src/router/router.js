import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home
		},
		{
			path: '/:pathMatch(.)',
			name: 'NotFound',
			component: Home
		}
	]
});

export default router;
