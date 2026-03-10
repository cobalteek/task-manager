import {defineStore} from 'pinia'
import {computed, ref} from "vue";

type User = { id: string; name: string; email?: string }

export const useUsersStore = defineStore('users', () => {
  const items = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const loadedOnce = ref(false)

  async function fetchUsers(opts?: { force?: boolean }) {
    if (isLoading.value) return
    if (loadedOnce.value && !opts?.force) return

    isLoading.value = true
    error.value = null

    try {
      items.value = await $fetch<User[]>('/api/users')
      loadedOnce.value = true
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || $t('error.user.loadUsers')
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const options = computed(() =>
    items.value.map(u => ({value: u.id, label: u.name}))
  )

  return {items, options, loading: isLoading, error, fetchUsers}
})
