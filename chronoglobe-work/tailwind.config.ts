import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#0B1A26",   // ocean ink, page background
        tide: "#13303F",    // panels
        brass: "#D2A24C",   // pins, primary accent
        chalk: "#E3EBEE",   // text
        ember: "#C4553B",   // conflict / alert events
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
