import {defineStore} from 'pinia'
import {ref} from "vue"
import type {Task} from '~~/types/task'

export const useTasksStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const isLoading = ref(false)

  async function fetchAll() {
    isLoading.value = true
    try {
      tasks.value = await $fetch<Task[]>('/api/tasks/tasksSearch')
    } finally {
      isLoading.value = false
    }
  }

  async function myFetch() {
    isLoading.value = true
    try {
      tasks.value = await $fetch<Task[]>('/api/tasks/myTasks')
    } finally {
      isLoading.value = false
    }
  }

  async function searchTasks(query: string) {
    tasks.value = await $fetch<Task[]>(
      `/api/tasks/taskSearch?q=${encodeURIComponent(query)}`
    )
  }

  async function createTask(title: string, description: string, deadline: Date | null) {
    isLoading.value = true
    try {
      const created = await $fetch<Task>('/api/tasks/tasks', {
        method: 'POST',
        body: {title, description, deadline}
      })

      tasks.value.unshift(created)
      return created
    } finally {
      isLoading.value = false
    }
  }

  async function updateTask(task: Task) {

    const updated = await $fetch<Task>(`/api/tasks/${task.id}/patch`, {
      method: 'PATCH',
      body: task,
    })
    tasks.value = tasks.value.map(p =>
      p.id === updated.id ? updated : p
    )
  }

  async function deleteTask(id: string) {
    await $fetch<Task>(`/api/tasks/${id}/delete`, {
      method: 'DELETE',
    })
  }

  return {
    tasks: tasks,
    isLoading,
    fetchAll,
    myFetch,
    createTask,
    searchTasks,
    updateTask,
    deleteTask
  }
})
