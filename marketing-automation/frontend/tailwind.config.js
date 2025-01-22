module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // Blue
        secondary: '#8b5cf6', // Purple
        accent: '#ec4899', // Pink
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      animation: {
        bounce: 'bounce 2s infinite',
        pulse: 'pulse 3s infinite',
      },
    },
  },
  plugins: [],
} 