export default defineNuxtConfig({
  nitro: {
    preset: "netlify"
  },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15'
})
