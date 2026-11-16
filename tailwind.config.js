/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        prevenix: {
          navy: '#07164D',
          'navy-dark': '#040d30',
          'navy-light': '#0c2275',
          blue: '#2584B2',
          'blue-light': '#3aa7dc',
          'blue-dark': '#1b6487',
          red: '#D92332',
          'red-dark': '#b31b27',
          'red-light': '#e84654',
          gray: '#F5F8FC',
          'gray-dark': '#E2EAF2',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(7, 22, 77, 0.08), 0 0 1px 1px rgba(7, 22, 77, 0.04)',
        'premium-hover': '0 30px 60px -15px rgba(7, 22, 77, 0.16), 0 0 1px 1px rgba(7, 22, 77, 0.06)',
        'glow-blue': '0 0 30px rgba(37, 132, 178, 0.35)',
        'glow-red': '0 0 30px rgba(217, 35, 50, 0.35)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #07164D 0%, #0c2275 60%, #153c9e 100%)',
        'radial-glow': 'radial-gradient(circle at 50% 50%, rgba(37, 132, 178, 0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}
