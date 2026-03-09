import {defineStore} from 'pinia'
import {computed, ref} from "vue";

type User = { id: string; name: string; email?: string }

export const useUsersStore = defineStore('users', () => {
  const items = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loadedOnce = ref(false)

  async function fetchUsers(opts?: { force?: boolean }) {
    if (loading.value) return
    if (loadedOnce.value && !opts?.force) return

    loading.value = true
    error.value = null

    try {
      items.value = await $fetch<User[]>('/api/users')
      loadedOnce.value = true
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || 'Failed to load users'
    } finally {
      loading.value = false
    }
  }

  const options = computed(() =>
    items.value.map(u => ({value: u.id, label: u.name}))
  )

  return {items, options, loading, error, fetchUsers}
})
