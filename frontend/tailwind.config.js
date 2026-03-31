/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: 'var(--primary)',
        'primary-dim': 'var(--primary-dim)',
        'primary-container': 'var(--primary-container)',
        'on-primary-container': 'var(--on-primary-container)',
        // Tertiary (AI accent)
        tertiary: 'var(--tertiary)',
        'tertiary-fixed': 'var(--tertiary-fixed)',
        'tertiary-container': 'var(--tertiary-container)',
        // Secondary
        secondary: 'var(--secondary)',
        // Surface
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-container-low': 'var(--surface-container-low)',
        'surface-container': 'var(--surface-container)',
        'surface-container-high': 'var(--surface-container-high)',
        'surface-container-highest': 'var(--surface-container-highest)',
        'surface-container-lowest': 'var(--surface-container-lowest)',
        'surface-bright': 'var(--surface-bright)',
        // Text
        'on-surface': 'var(--on-surface)',
        'on-surface-variant': 'var(--on-surface-variant)',
        // Outline
        'outline-variant': 'var(--outline-variant)',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
      transitionDuration: {
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease-spring': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};