// app/middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import {useAuthStore} from "~~/stores/auth";

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  if (!auth.isReady) {
    await auth.init()
  }

  if (!auth.isAuthed) {
    return navigateTo('/sign-in')
  }
})
