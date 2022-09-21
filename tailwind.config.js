const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
	theme: {
		container: {
			center: true,
			padding: '1rem',
		},
		fontFamily: {
			sans: ['Lato', ...defaultTheme.fontFamily.sans],
			heading: ['Roboto Slab', 'sans-serif'],
		},
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1200px',
		},
		extend: {},
	},
	plugins: [require('@tailwindcss/typography')],
}
