/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f1',
          100: '#d9e5dc',
          200: '#b8cfbd',
          300: '#8fb59a',
          400: '#6a9c79',
          500: '#4a7c5e',  // Main green
          600: '#3c6642',  // Dark green for buttons
          700: '#2f5233',  // Darker green
          800: '#253f28',
          900: '#1d3320',
        },
        accent: {
          light: '#c5d9b5',  // Light green for chips
          DEFAULT: '#8fb59a',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'card': '16px',
        'chip': '20px',
      },
    },
  },
  plugins: [],
}
