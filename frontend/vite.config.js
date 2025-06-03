import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react()],
	server: {
		host: true,
		port: 5173,
		cors: true,
	},
	preview: {
		host: '0.0.0.0',
		port: process.env.PORT || 3000,
		allowedHosts: [
			'healthcheck.railway.app',
			'sistema-indicadores-production.up.railway.app'
		],
	},
	build: {
		outDir: 'dist',
		sourcemap: false,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom'],
					router: ['react-router-dom'],
					charts: ['recharts'],
					gantt: ['@syncfusion/ej2-react-gantt', 'wx-react-gantt'],
				},
			},
		},
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
