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
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],

  i18n: {
    defaultLocale: 'ru',
    locales: [
      { code: 'ru', name: 'Русский', file: 'ru.ts' },
      { code: 'en', name: 'English', file: 'en.ts' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root'
    },
    strategy: 'no_prefix',
    experimental: {
      localeDetector: '../i18n/localeDetector.ts',
    },
    vueI18n: '../i18n.config.ts'
  },

  devtools: {
    enabled: true
  },

  routeRules: {
    '/': {prerender: true}
  },

  compatibilityDate: '2025-01-15'
})
