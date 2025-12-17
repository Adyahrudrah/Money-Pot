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
        bgc_1: "#18181b",
        bgc_2: "#27272a",
        bgc_3: "#52525b",
        tc_1: "#d4d4d8",
        bc_1: "#52525b",
        accent: "#f43f5e",
        success: "#10b981",
        error: "#f43f5e",
      },
    },
  },
  plugins: [],
};
