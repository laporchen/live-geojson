// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  nitro: {
    preset: "cloudflare_module",
    experimental: {
      websocket: true
    }
  },

  modules: ["nitro-cloudflare-dev", "@nuxtjs/leaflet"],

  runtimeConfig: {
    public: {
      server: 'localhost:8787'
    }
  },

  ssr: false
})
