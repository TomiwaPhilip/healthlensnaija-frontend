/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"], // Include JSX and TSX files
 theme: {
  extend: {
    colors: {
      primary: "var(--color-primary)",
      "primary-2": "var(--color-primary-2)",
    },
  },
},
  plugins: [],
};
