import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      },
      margin: {
        30: '7.5rem',
        32: '8rem',
        36: '9rem',
        40: '10rem',
        44: '11rem',
        48: '12rem',
        52: '13rem',
        56: '14rem',
        60: '15rem',
        64: '16rem',
        68: '17rem',
        72: '18rem',
        76: '19rem',
        80: '20rem',
        84: '21rem',
        88: '22rem',
        92: '23rem',
        96: '24rem',
        100: '25rem',
        104: '26rem',
        108: '27rem',
        112: '28rem',
        116: '29rem',
        120: '30rem',
        124: '31rem',
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
        184: '46rem',
        188: '47rem',
        192: '48rem',
        196: '49rem',
        200: '50rem',
        204: '51rem',
        208: '52rem',
        212: '53rem',
        216: '54rem',
        220: '55rem',
        224: '56rem',
        228: '57rem',
        232: '58rem',
        236: '59rem',
        240: '60rem'
      }
    }
  },

  
  plugins: []
} satisfies Config
