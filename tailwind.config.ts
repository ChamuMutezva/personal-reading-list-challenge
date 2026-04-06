module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        primary: 'var(--primary)',
        'primary-container': 'var(--primary-container)',
        secondary: 'var(--secondary)',
        'tertiary-container': 'var(--tertiary-container)',
        'on-surface-variant': 'var(--on-surface-variant)',
        'outline-variant': 'var(--outline-variant)',
      },
      fontFamily: {
        headline: ['var(--font-headline)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        label: ['var(--font-label)', 'sans-serif'],
      },
    },
  },
}