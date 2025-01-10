export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      height: {
        128: '32rem',
        192: '48rem',
        256: '64rem',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    logs: false,
    themes: [
      'pastel',
      {
        gruvbox: {
          primary: '#448588',
          secondary: '#689d6a', // fixme
          accent: '#d65d0e', //fixme
          neutral: '#1d2021',
          'base-100': '#32302f',
          info: '#ebdbb2',
          success: '#8ec07c',
          warning: '#fabd2f',
          error: '#fb4934',
        },
      },
    ],
  },
};
