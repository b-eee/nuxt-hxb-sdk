import { defineNuxtConfig } from "nuxt/config";
import ElementPlus from "unplugin-element-plus/vite";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  target: "static",
  env: {
    baseUrl: 'https://hxb-graph.hexabase.com/graphql',
  },
    publicRuntimeConfig: {
      baseUrl: process.env.URL || 'https://hxb-graph.hexabase.com/graphql',
  },
  head: {
    title: "nuxt-hxb-sdk",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/png", href: "../public/favicon.png" }],
  },

  // css
  css: ["~/assets/scss/index.scss"],

  // build
  build: {
    transpile: ["element-plus/es"],
  },

  typescript: {
    strict: true,
    shim: false,
  },

  vite: {
    plugins: [ElementPlus()],
  },

  // build modules
  modules: ["@vueuse/nuxt", "@unocss/nuxt", "@pinia/nuxt"],

  // auto import components
  components: true,

  // vueuse
  vueuse: {
    ssrHandlers: true,
  },

  unocss: {
    uno: true,
    attributify: true,
    icons: {
      scale: 1.2,
    },
  },
});
