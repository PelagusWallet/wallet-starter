/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */

module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Georgia", "serif"],
      quai: ["Bai Jamjuree", "serif"]
    },
    extend: {
      colors: {
        "quai-red": "#e20101",
        "quai-black": "#000000",
        "quai-dark-grey": "#202020",
        "quai-grey": "#393939",
        "quai-mid-grey": "#646464",
        "quai-light-grey": "#a1a1a1",
        "quai-off-white": "#e2e2e2",
        "quai-white": "ffffff",
        "quai-orange": "#ee4c22",
        "quai-saffron": "#fe9b40",
        "quai-yellow": "#ffc35a",
        "quai-apricot": "#fec888",
        "quai-deep-teal": "#0f4841",
        "quai-teal": "#2c827d",
        "footer-teal": "#001216",
        "border-teal": "#25687F",
        "footer-blue": "#01192C",
        "pelagus-blue": "#014164",
        "embark-blue": "#016789",
        "lagos-blue": "#015375",
        "light-blue": "#017c9f"
      },
      backdropBlur: {
        'none': '0',
        'sm': '5px',
        'DEFAULT': '10px',
        'md': '15px',
        'lg': '20px',
        'xl': '25px',
        '2xl': '30px',
        '3xl': '35px',
      },
      transitionDuration: {
        '0': '0ms',
        '2000': '2000ms', // add 2000ms transition
      },
    }
  },
  variants: { extend: { typography: ["dark"] } },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")]
}
