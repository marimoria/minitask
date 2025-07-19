import { createApp } from 'vue';

import App from './App.vue';
import router from './router/router.js';

function initApp() {
	const app = createApp(App);
	app.use(router).mount('#app');

	function setVH() {
		const vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	}

	window.addEventListener('resize', setVH);
	window.addEventListener('orientationchange', setVH);
	setVH();
}

initApp();
