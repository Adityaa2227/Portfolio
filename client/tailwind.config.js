/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: v('background'),
        surface: v('surface'),
        'surface-muted': v('surface-muted'),
        'surface-tint': v('accent-tint'),
        foreground: v('foreground'),
        'text-muted': v('text-muted'),
        'text-subtle': v('text-subtle'),
        accent: v('accent'),
        'accent-2': v('accent-2'),
        'accent-dark': v('accent-strong'),
        'accent-tint': v('accent-tint'),
        planned: v('planned'),
        border: v('border'),
        'border-strong': v('border-strong'),
        'border-subtle': v('border-subtle'),
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 2px rgb(0 0 0 / 0.06)',
        float: '0 18px 40px -18px rgb(0 0 0 / 0.35)',
        'cobalt-sm': '0 4px 14px rgb(var(--c-accent) / 0.2)',
      },
      maxWidth: { page: '76rem' },
    },
  },
  plugins: [],
}
