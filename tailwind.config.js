/** @type {import('tailwindcss').Config} */

// Les couleurs passent par des variables CSS (canaux RGB) définies dans input.css :
// un seul jeu de classes sert les deux thèmes, sans variantes dark:.
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        canvas: token('canvas'),
        surface: token('surface'),
        raised: token('raised'),
        line: token('line'),
        field: token('field'),
        ink: token('ink'),
        muted: token('muted'),
        accent: token('accent'),
        'on-accent': token('on-accent'),
        danger: token('danger'),
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        // Typographie fluide : minimum mobile (360 px), maximum à partir de 1280 px environ
        display: ['clamp(2.75rem, 1.9rem + 3.8vw, 5.25rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        h2: ['clamp(2rem, 1.55rem + 2vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        h3: ['clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)', { lineHeight: '1.25' }],
        lead: ['clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)', { lineHeight: '1.65' }],
      },
      spacing: {
        section: 'clamp(4.5rem, 3.5rem + 5vw, 8rem)',
        gutter: 'clamp(1rem, 0.4rem + 2.6vw, 2.5rem)',
        header: '4.5rem',
        tap: '2.75rem', // 44 px : taille minimale des zones tactiles
      },
      maxWidth: {
        content: '75rem', // 1200 px
        prose: '62ch',
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        lg: '0.75rem',
      },
      boxShadow: {
        lift: '0 18px 40px -24px rgb(var(--c-shadow) / 0.55)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
