import {defineStore} from 'pinia'
import {computed, ref} from "vue"
import type {Status} from '~~/types/status'

export const useStatusesStore = defineStore('statuses', () => {
  const statuses = ref<Status[]>([])
  const isLoading = ref(false)

  async function fetchAll() {
    isLoading.value = true
    try {
      statuses.value = await $fetch<Status[]>('/api/statuses')
    } finally {
      isLoading.value = false
    }
  }

  async function updateStatus(projectId: string, statusId: number) {
    await $fetch(`/api/projects/${projectId}/status`, {
      method: "PATCH",
      body: {statusId},
    })
  }

  const options = computed(() =>
    statuses.value.map(u => ({value: u.id, label: u.name}))
  )

  return {items: statuses, isLoading, options, fetchAll, updateStatus}
})
