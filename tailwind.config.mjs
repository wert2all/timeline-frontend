const extendHeight = {
  128: '32rem',
  132: '33rem',
  136: '34rem',
  140: '35rem',
  144: '36rem',
  148: '37rem',
  152: '38rem',
  156: '39rem',
  160: '40rem',
  164: '41rem',
  168: '42rem',
  172: '43rem',
  176: '44rem',
  180: '45rem',
  192: '48rem',
  256: '64rem',
};
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
