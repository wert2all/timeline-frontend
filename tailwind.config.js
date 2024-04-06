/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    logs: false,
    themes: [
      {
        gruvbox: {
          primary: '#448588',
          secondary: '#689d6a',
          accent: '#0033ff', //fixme
          neutral: '#1d2021',
          'base-100': '#32302f',
          info: '#ebdbb2',
          success: '#98971a',
          warning: '#d65d0e',
          error: '#ff2a4d',
        },
      },
    ],
  },
};
