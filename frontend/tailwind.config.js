/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom Zealthy-inspired color scheme
        cream: {
          50: '#FFFAF2',  // Main background
          100: '#FFF5E6',
        },
        mint: {
          50: '#E9F7EE',  // Secondary background
          100: '#D4EFE0',
        },
        primary: {
          DEFAULT: '#0B5D1E',  // Primary CTA Green
          dark: '#084515',
          light: '#0D7024',
        },
        accent: {
          DEFAULT: '#37B24D',  // Accent Green
          light: '#51CF66',
          dark: '#2F9E44',
        },
        text: {
          primary: '#000000',
          secondary: '#6B6B6B',
          muted: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'hard': '0 10px 40px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
