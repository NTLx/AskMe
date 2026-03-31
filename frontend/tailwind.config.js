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
        'primary-fixed': 'var(--primary-fixed)',
        'on-primary': 'var(--on-primary)',
        'on-primary-container': 'var(--on-primary-container)',
        // Secondary
        secondary: 'var(--secondary)',
        'secondary-container': 'var(--secondary-container)',
        'on-secondary': 'var(--on-secondary)',
        'on-secondary-container': 'var(--on-secondary-container)',
        // Tertiary (AI accent)
        tertiary: 'var(--tertiary)',
        'tertiary-container': 'var(--tertiary-container)',
        'on-tertiary': 'var(--on-tertiary)',
        'on-tertiary-container': 'var(--on-tertiary-container)',
        // Surface
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-container-low': 'var(--surface-container-low)',
        'surface-container-lowest': 'var(--surface-container-lowest)',
        'surface-container': 'var(--surface-container)',
        'surface-container-high': 'var(--surface-container-high)',
        'surface-container-highest': 'var(--surface-container-highest)',
        'surface-variant': 'var(--surface-variant)',
        'surface-dim': 'var(--surface-dim)',
        'surface-bright': 'var(--surface-bright)',
        // Text
        'on-surface': 'var(--on-surface)',
        'on-surface-variant': 'var(--on-surface-variant)',
        'on-surface-muted': 'var(--on-surface-muted)',
        // Outline
        outline: 'var(--outline)',
        'outline-variant': 'var(--outline-variant)',
        // Shadow
        shadow: 'var(--shadow)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Manrope', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        // Display
        'display-lg': ['3rem', { lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
        // Headline
        'headline-lg': ['1.5rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.02em' }],
        'headline-md': ['1.25rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.02em' }],
        // Title
        'title-lg': ['1.125rem', { lineHeight: '1.4', fontWeight: '500' }],
        'title-md': ['1rem', { lineHeight: '1.4', fontWeight: '500' }],
        // Body
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        // Label
        'label-lg': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
        'label-md': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glow: 'var(--shadow-glow)',
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'ease-spring': 'cubic-bezier(0.4, 0, 0.2, 1)',
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      screens: {
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1023px'},
        'desktop': {'min': '1024px'},
      },
    },
  },
  plugins: [],
};