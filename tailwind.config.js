/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class', // 👈 THÊM DÒNG NÀ
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 bắt buộc để Tailwind hoạt động
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        // Thêm các biến khác nếu cần
      },
    },
  },
  plugins: [

  ],
}
