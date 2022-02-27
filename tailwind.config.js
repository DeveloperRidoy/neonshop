module.exports = {
  mode: "jit", 
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: { 
      colors: {
        accent: "#1e272e",
      },
      screens: {
        'xs': "300px"
      }
    },
  },
  variants: {
    extend: {}, 
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
  