/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'dark-bg': '#121212', // Dark background for the whole screen
        'editor-gray': '#1e1e1e', // Code editor-like background
        'code-yellow': '#dcdcaa', // For keys and numbers
        'code-blue': '#9cdcfe', // For strings
        'code-green': '#b5cea8', // For booleans
      },
      fontFamily: {
        'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
};
