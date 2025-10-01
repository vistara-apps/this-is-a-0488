/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 100%, 50%)',
        'primary-hover': 'hsl(210, 100%, 45%)',
        accent: 'hsl(142, 76%, 36%)',
        'accent-hover': 'hsl(142, 76%, 32%)',
        'progress-bar': 'hsl(142, 76%, 36%)',
        'progress-bg': 'hsl(210, 20%, 95%)',
        text: 'hsl(210, 24%, 16%)',
        'text-muted': 'hsl(210, 10%, 50%)',
        border: 'hsl(210, 18%, 87%)',
        'bg-secondary': 'hsl(210, 20%, 98%)',
        surface: 'hsl(0, 0%, 100%)',
        'surface-hover': 'hsl(210, 15%, 97%)',
        error: 'hsl(0, 72%, 51%)',
        warning: 'hsl(38, 92%, 50%)',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '32px',
        '2xl': '48px',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      boxShadow: {
        'card': '0 8px 24px hsla(210, 15%, 20%, 0.08)',
        'hover': '0 12px 32px hsla(210, 15%, 20%, 0.12)',
        'widget': '0 4px 12px hsla(210, 15%, 20%, 0.06)',
      },
      animation: {
        'progress-fill': 'progress-fill 0.5s ease-out',
      },
      keyframes: {
        'progress-fill': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
    },
  },
  plugins: [],
}