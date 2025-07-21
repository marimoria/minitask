import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()]
	},
	preload: {
		plugins: [externalizeDepsPlugin()]
	},
	renderer: {
		resolve: {
			alias: {
				'@renderer': resolve('src/renderer/src')
			}
		},
		plugins: [vue()],
		server: {
			proxy: {
				// DEV ONLY CONFIG
				'/api': {
					target: 'http://localhost:5000',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, '')
				}
			}
		}
	}
});
