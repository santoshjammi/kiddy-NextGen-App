import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'ps-blue':   '#0070cc',
        'ps-cyan':   '#1eaedb',
        'ice-mist':  '#f5f7fa',
        'charcoal':  '#1f1f1f',
        'body-gray': '#6b6b6b',
        'ps-footer': '#003791',
        'muted':     '#cccccc',
      },
      fontFamily: {
        'display': ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
        'fredoka': ['"Fredoka One"', '"Comic Sans MS"', 'cursive', 'sans-serif'],
        'poppins': ['"Poppins"', '"Arial"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'rainbow': 'rainbowText 3s ease-in-out infinite',
        'bounce-custom': 'bounce 2s infinite',
      },
      keyframes: {
        rainbowText: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        bounce: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
