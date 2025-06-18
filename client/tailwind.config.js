/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure correct path for Vite
  ],
  theme: {
    extend: {
    colors: {
  primary: '#1B3A2F',
  accent: '#F4A261',
  'accent-dark': '#e07b39',
  offWhite: '#F8F9F9',
  grayLight: '#D3D3D3',
},

daisyui: {
    themes: ["light", "dark"], // light is first = default
  },
    },
  },
  plugins: [],
}
