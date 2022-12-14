"use strict";
exports.__esModule = true;
var config_1 = require("nuxt/config");
var vite_1 = require("unplugin-element-plus/vite");
exports["default"] = (0, config_1.defineNuxtConfig)({
    ssr: false,
    target: "static",
    env: {
        baseUrl: 'https://hxb-graph.hexabase.com/graphql'
    },
    publicRuntimeConfig: {
        baseUrl: process.env.URL || 'https://hxb-graph.hexabase.com/graphql'
    },
    head: {
        title: "nuxt-hxb-sdk",
        htmlAttrs: {
            lang: "en"
        },
        meta: [
            { charset: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { hid: "description", name: "description", content: "" },
            { name: "format-detection", content: "telephone=no" },
        ],
        link: [{ rel: "icon", type: "image/png", href: "../public/favicon.png" }]
    },
    // css
    css: ["~/assets/scss/index.scss"],
    // build
    build: {
        transpile: ["element-plus/es"]
    },
    typescript: {
        strict: true,
        shim: false
    },
    vite: {
        plugins: [(0, vite_1["default"])()]
    },
    // build modules
    modules: ["@vueuse/nuxt", "@unocss/nuxt", "@pinia/nuxt"],
    // auto import components
    components: true,
    // vueuse
    vueuse: {
        ssrHandlers: true
    },
    unocss: {
        uno: true,
        attributify: true,
        icons: {
            scale: 1.2
        }
    }
});
