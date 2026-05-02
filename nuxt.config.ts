// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  nitro: {
    preset: 'cloudflare-pages'
  },

  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-auth-utils',
  ],

  runtimeConfig: {
    blogPasswordHash: process.env.BLOG_PASSWORD_HASH,
  },

  routeRules: {
    '/studio/**': { ssr: false },
  },

  app: {
    head: {
      title: 'Flow with Feb',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
      script: [
        {
          innerHTML: '(function(){var m=localStorage.getItem("color-mode");if(m==="dark")document.documentElement.classList.add("dark")})()',
          type: 'text/javascript',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/bb.png' },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap',
        },
      ],
    },
  },
})
