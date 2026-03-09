import {defineNuxtPlugin} from "nuxt/app"
import {useAuthStore} from "../app/stores/auth";

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  await authStore.fetchMe()
})
