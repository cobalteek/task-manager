import { defineStore } from 'pinia'

type User = {
  id: string
  email: string
  name: string
} | null

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User>(null)
  const isReady = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthed = computed(() => !!user.value)

  async function fetchMe() {
    try {
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

      user.value = await $fetch<User>('/api/auth/me', {
        credentials: 'include',
        headers,
      })
    } catch (e: any) {
      user.value = null
      if (e?.statusCode !== 401 && e?.status !== 401) throw e
    }
  }

  async function init() {
    if (isReady.value) return
    isLoading.value = true
    error.value = null
    try {
      await fetchMe()
    } finally {
      isLoading.value = false
      isReady.value = true
    }
  }

  async function signIn(payload: { email: string; password: string }) {
    isLoading.value = true
    error.value = null
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: payload,
        credentials: 'include',
      })

      // cookie уже установлена сервером — теперь получаем user
      await fetchMe()
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Sign in error'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function signUp(payload: { name: string; email: string; password: string }) {
    isLoading.value = true
    error.value = null
    try {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: payload,
        credentials: 'include',
      })

      await fetchMe()
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    user.value = null
    await $fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
  }

  return {
    user,
    isAuthed,
    isReady,
    isLoading,
    error,
    init,
    fetchMe,
    signIn,
    signUp,
    logout,
  }
})
