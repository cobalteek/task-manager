import { defineNuxtPlugin } from "nuxt/app"
import {useAuthStore} from "../stores/auth";

export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  await auth.init()
})
