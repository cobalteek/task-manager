import type { User } from '../types/user.ts'

export function useAuth() {
  const user = useState<User | null>('user', () => null)
  const authReady = useState<boolean>('authReady', () => false)

  async function fetchUser() {
    console.log('fetchUser: start')
    try {
      const data = await $fetch<User>('/api/auth/me', { credentials: 'include' })
      console.log('fetchUser: ok', data)
      user.value = data
    } catch (e) {
      console.log('fetchUser: error', e)
      user.value = null
    } finally {
      console.log('fetchUser: finally')
      authReady.value = true
    }
  }

  async function login(email: string, password: string) {
    authReady.value = false
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      credentials: 'include',
    })
    await fetchUser()
  }

  async function logout() {
    authReady.value = false
    await $fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    user.value = null
  }

  return { user, authReady, fetchUser, login, logout }
}
