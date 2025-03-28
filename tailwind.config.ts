import type { Config, } from "tailwindcss";

export default {
  content: ["./app/**/{**,client,server}/**/*.{js,jsx,ts,tsx,html}"],
  darkMode: "selector",
  theme: {
    extend: {
      fontFamily: {
        sans: [

          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        'dots': "url('./app/static/dots.png')",
      },
    },
    screens: {
      xs: "380px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      phone: {'max': '640px'},
      desktop: {'min': '641px'},
    },
  },
  plugins: [require('tailwindcss-motion')],
} satisfies Config;
