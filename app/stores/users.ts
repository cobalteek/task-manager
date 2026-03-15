import {defineStore} from 'pinia'
import {computed, ref} from "vue";

type User = { id: string; name: string; email?: string }

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const loadedOnce = ref(false)

  async function fetchUsers(role?: string, opts?: { force?: boolean }) {
    if (isLoading.value) return
    if (loadedOnce.value && !opts?.force) return

    isLoading.value = true
    error.value = null

    try {
      const query = role ? `?role=${encodeURIComponent(role)}` : ''

      users.value = await $fetch<User[]>(`/api/users${query}`)
      loadedOnce.value = true
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || $t('error.user.loadUsers')
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const options = computed(() =>
    users.value.map(u => ({value: u.id, label: u.name}))
  )

  return {items: users, options, loading: isLoading, error, fetchUsers}
})
