import {defineStore} from 'pinia'
import {ref} from "vue"
import type {Task} from '~~/types/task'

export const useTasksStore = defineStore('task', (event) => {
  const tasks = ref<Task[]>([])
  const isLoading = ref(false)

  async function fetchAll(projectId: string) {
    isLoading.value = true
    try {
      tasks.value = await $fetch<Task[]>(`/api/projects/${projectId}/tasks/tasks`)
    } finally {
      isLoading.value = false
    }
  }

  async function myFetch(projectId: string) {
    isLoading.value = true
    try {
      tasks.value = await $fetch<Task[]>(`/api/projects/${projectId}/tasks/myTasks`)
    } finally {
      isLoading.value = false
    }
  }

  async function searchTasks(query: string) {
    tasks.value = await $fetch<Task[]>(
      `/api/tasks/taskSearch?q=${encodeURIComponent(query)}`
    )
  }

  async function createTask(projectId: string, title: string, description: string, deadline: Date | null, handlerId: string) {
    isLoading.value = true
    try {
      const created = await $fetch<Task>(`/api/projects/${projectId}/tasks/task`, {
        method: 'POST',
        body: {title, description, deadline, handlerId}
      })

      tasks.value.unshift(created)
      return created
    } finally {
      isLoading.value = false
    }
  }

  async function updateTask(projectId: string, task: Task) {
    const updated = await $fetch<Task>(`/api/projects/${projectId}/tasks/${task.id}/patch`, {
      method: 'PATCH',
      body: task,
    })
    tasks.value = tasks.value.map(p =>
      p.id === updated.id ? updated : p
    )
  }

  async function deleteTask(projectId: string, taskId: string) {
    await $fetch<Task>(`/api/projects/${projectId}/tasks/${taskId}/delete`, {
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
