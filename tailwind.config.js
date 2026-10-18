/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4fa',
          100: '#dce5f1',
          200: '#b9cce3',
          300: '#8ba8cf',
          400: '#5d7eb5',
          500: '#3d5e98',
          600: '#2c467b',
          700: '#233a66',
          800: '#1d3055',
          900: '#172641',
          950: '#0f1a2e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Tahoma', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
