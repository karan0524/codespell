/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
    },

    extend: {
      screens: {
        '2xl': '1250px',
      },

      backgroundImage: {
        'home-radial': 'radial-gradient(circle farthest-side at 0% 0%, #173030, var(--codespell-background))',
      },

      fontSize: {
        '34':"34px",
        '32':"32px",
        '36':"36px",
        '50':"50px",
        '56': '56px',
        '64':"64px",
      },

      colors: {
        primary: "#00bcbc",
        secondary: "#040303",
        shade100:"#ddd",
        textshade100:"#e0e0e0",
        bgdark:"#040303",
      },
      letterSpacing: {
        tight02: '0.2px',
      },
      lineHeight: {
        tightest: '100%',   // 1
        lessTighter :'120%',
        tight: '130%',
        mediumLoose: '150%',      // 1.5
        loose: '170%',      // 1.7
        67: '67.2px',
      },

      fontFamily: {
        Figtree: ["Figtree", "sans-serif"],
      },
      spacing: {
        '0.5': '2px',
        '2.5': '10px',
        '6.5': '26px',
        '17':'72px',
        '120':'120px'
      },

    },
  },
  plugins: [],
}