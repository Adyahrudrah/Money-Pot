/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg_primary: "#18181b",
        bg_secondary: "#a1a1aa",
        bg_tertiary: "#d4d4d8",
        text_primary: "#d4d4d8",
        accent: "#f43f5e",
        success: "#065f46",
        error: "#991b1b",
      },
    },
  },
  plugins: [],
};
