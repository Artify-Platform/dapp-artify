import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(234.57% 106.66% at 49.99% 0.06%, #B6FFED 0%, #E0C6FF 45.56%, #ACAFFF 100%)',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        DrukTextWideTrial: 'Druk Text Wide Trial',
        SFProDisplay: 'SF PRO DISPLAY',
        Poppins: 'Poppins',
      },
      colors: {
        primary: '#3b3b3b',
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: Function }) {
      const newUtilities = {
        '.scrollbar-thin': {
          srollbarWidth: '6px',
          scrollbarColor: '#73C4FF',
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'transparent',
            borderRadius: '100px',
            border: '6px solid #73C4FF',
          },
        },
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
}
export default config
