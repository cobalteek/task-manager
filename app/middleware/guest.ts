import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import {useAuthStore} from "~~/stores/auth";

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  const { user} = storeToRefs(auth)

  if (!auth.isReady) await auth.init()
  if (user.value) return navigateTo('/dashboard')
})
