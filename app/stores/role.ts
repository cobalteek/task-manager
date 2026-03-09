import {defineStore} from 'pinia'
import {computed, ref} from "vue"
import type {Status} from '~~/types/status'

export const useRolesStore = defineStore('roles', () => {
  const roles = ref<Status[]>([])
  const isLoading = ref(false)

  async function fetchAll() {
    isLoading.value = true
    try {
      roles.value = await $fetch<Status[]>('/api/roles')
    } finally {
      isLoading.value = false
    }
  }

  async function changeRole(candidate: string, roleId: number) {
    await $fetch('/api/changeRole', {
      method: "POST",
      body: {candidate: candidate, roleId: roleId}
    })

  }

  const options = computed(() =>
    roles.value.map(u => ({value: u.id, label: u.name}))
  )

  return {items: roles, isLoading, options, fetchAll, changeRole}
})
