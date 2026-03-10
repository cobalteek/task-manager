import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  nitro: {
    preset: "netlify"
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [
    '@pinia/nuxt'
  ],

  devtools: {
    enabled: true
  },

  routeRules: {
    '/': {prerender: true}
  },

  compatibilityDate: '2025-01-15'
})
