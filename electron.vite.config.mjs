import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';

const isDev = process.env.NODE_ENV !== 'production';

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
			// Dev server
			...(isDev && {
				proxy: {
					'/api': {
						target: 'http://localhost:5000',
						changeOrigin: true,
						rewrite: (path) => path.replace(/^\/api/, '')
					}
				}
			})
		}
	}
});
