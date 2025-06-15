/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class', // 👈 THÊM DÒNG NÀ
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 bắt buộc để Tailwind hoạt động
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
