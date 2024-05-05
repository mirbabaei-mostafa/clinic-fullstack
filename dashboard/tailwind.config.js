/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        main: "url('images/bg.png')",
      },
      colors: {
        myblue: {
          verylight: '#95daf9',
          light: '#38b5ed',
          DEFAULT: '#0682b9',
          dark: '#004b6d',
        },
        mydarkblue: {
          light: '#324f8c',
          DEFAULT: '#243456',
          dark: '#1b2437',
        },
        mygray: {
          verylight: '#dedede',
          light: '#e6e9ec',
          DEFAULT: '#b1b1b1',
          dark: '#808080',
        },
      },
    },
    fontFamily: {
      text: ['Roboto'],
      title: ['Ubuntu'],
      info: ['Kanit'],
      special: ['Josefin Sans'],
    },
  },
  plugins: [],
};
