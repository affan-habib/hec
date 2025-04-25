/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Korean-inspired color palette
        'hanbok-pink': '#F8B3D0',
        'hanbok-blue': '#7BA9CE',
        'hanbok-yellow': '#F9D949',
        'hanbok-green': '#8CC084',
        'celadon': '#A4C3B2',
        'dancheong-red': '#E74C3C',
        'dancheong-blue': '#3498DB',
        'dancheong-green': '#2ECC71',
        'dancheong-yellow': '#F1C40F',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'hanbok': '0 4px 6px -1px rgba(123, 169, 206, 0.1), 0 2px 4px -1px rgba(123, 169, 206, 0.06)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
