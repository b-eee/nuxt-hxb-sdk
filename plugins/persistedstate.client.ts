// /plugins/persistedstate.client.ts

import { createPersistedState } from 'pinia-plugin-persistedstate'
import {defineNuxtPlugin} from "#imports";


export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.$pinia.use(createPersistedState())
})
