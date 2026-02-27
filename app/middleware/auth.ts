import { defineNuxtRouteMiddleware, navigateTo, useRequestFetch } from "nuxt/app"

export default defineNuxtRouteMiddleware(async () => {
  const requestFetch = useRequestFetch()

  try {
    await requestFetch('/api/auth/me')
  } catch {
    return navigateTo('/sign-in')
  }
})
