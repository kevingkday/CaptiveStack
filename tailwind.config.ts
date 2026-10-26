import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				brand: {
					50: '#f0f7ff',
					100: '#e0effe',
					200: '#bae0fd',
					300: '#7cc7fb',
					400: '#38a8f8',
					500: '#0e8ce9',
					600: '#026fc7',
					700: '#0358a1',
					800: '#074b85',
					900: '#0c3f6e',
					950: '#082849'
				},
				captive: {
					navy: '#0b132b',
					slate: '#1c2541',
					steel: '#3a506b',
					cyan: '#5bc0be',
					accent: '#6fffe9'
				}
			},
			fontFamily: {
				sans: [
					'Inter',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'sans-serif'
				]
			}
		}
	},
	plugins: []
};

export default config;
