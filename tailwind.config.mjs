/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cad: {
          canvas: '#D4D8DC',
          canvasDark: '#C8CDD2',
          surface: '#DCE0E4',
          ink: '#0A0A0A',
          muted: '#4A5056',
          line: 'rgba(10, 10, 10, 0.22)',
          grid: 'rgba(10, 10, 10, 0.07)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
