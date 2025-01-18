const extendHeight = {
  92: '23rem',
  128: '32rem',
  192: '48rem',
  256: '64rem',
};
const daisyuiThemes = require('daisyui/src/theming/themes');
const pastelTheme = daisyuiThemes['pastel'];

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      height: extendHeight,
      minHeight: extendHeight,
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    logs: false,
    themes: [
      {
        pastel: {
          ...pastelTheme,
          'base-200': '#e8e8e8',
        },
      },
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
