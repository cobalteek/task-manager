import { useCookie } from "nuxt/app"
import { defineStore } from 'pinia'
import {ref } from "vue"

type Task = {
  id: string
  title: string
  done: boolean
}

export const useTasksStore = defineStore('tasks', () => {
  const items = ref<Task[]>([])
  const isLoading = ref(false)

  async function fetchAll() {
    isLoading.value = true
    try {
      items.value = await $fetch<Task[]>('/api/tasks')
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(title: string) {
    const created = await $fetch<Task>('/api/tasks', {
      method: 'POST',
      body: { title },
    })
    items.value.unshift(created)
  }

  return { items, isLoading, fetchAll, createTask }
})
