// File: formAI/frontend/tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'blue-600': '#3B82F6',
        'yellow-400': '#FBBF24',
        'green-500': '#10B981',
        'red-500': '#EF4444',
        'purple-500': '#A78BFA',
        'gray-50': '#F3F4F6',
        'gray-600': '#374151',
      },
      transitionDuration: {
        '200': '200ms',
      },
      transitionProperty: {
        'shadow': 'box-shadow',
      },
    },
  },
  plugins: [],
};