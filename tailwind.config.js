// tailwind.config.js


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // 이 경로를 통해 Tailwind가 CSS 클래스를 추적할 수 있습니다.
  ],
  theme: {
    extend: {
      colors: {
        'customColor': '#4798b8'
      },
      backgroundImage: {
        'customBack': "url('/src/assets/Login-scene.jpg')",
      }
    },
  },
  plugins: [],
}
