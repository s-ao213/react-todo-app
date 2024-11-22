/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      screens: {
        mobile: { max: "640px" }, // 640px以下をモバイルとみなす
      },
    },
  },
};
