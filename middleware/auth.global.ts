import { defineNuxtRouteMiddleware, navigateTo } from '#app'
export default defineNuxtRouteMiddleware(async (to) => {
  const publicPages = ['/sign-in', '/sign-up']
  if (publicPages.includes(to.path)) return

  try {
    await fetch('/api/auth/me')
  } catch {
    return navigateTo('/sign-in')
  }
})
