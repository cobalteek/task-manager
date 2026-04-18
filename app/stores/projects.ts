import {defineStore} from 'pinia'
import {ref} from "vue"
import type {Project} from '~~/types/project'
import {useTasksStore} from "~/stores/tasks";

export const useProjectsStore = defineStore('project', () => {
  const projects = ref<Project[]>([])
  const isLoading = ref(false)

  async function fetchAll() {
    isLoading.value = true
    try {
      projects.value = await $fetch<Project[]>('/api/projects/projectSearch')
    } finally {
      isLoading.value = false
    }
  }

  async function myFetch() {
    isLoading.value = true
    try {
      projects.value = await $fetch<Project[]>('/api/projects/myProjects')
    } finally {
      isLoading.value = false
    }
  }

  async function searchProjects(query: string) {
    projects.value = await $fetch<Project[]>(
      `/api/projects/projectSearch?q=${encodeURIComponent(query)}`
    )
  }

  async function createProject(title: string, description: string, deadline: Date | null, handlerId: string) {
    isLoading.value = true
    try {
      const created = await $fetch<Project>('/api/projects/projects', {
        method: 'POST',
        body: {title, description, deadline, handlerId}
      })

      projects.value.unshift(created)
      return created
    } finally {
      isLoading.value = false
    }
  }

  async function updateProject(project: Project) {

    const updated = await $fetch<Project>(`/api/projects/${project.id}/patch`, {
      method: 'PATCH',
      body: project,
    })
    projects.value = projects.value.map(p =>
      p.id === updated.id ? updated : p
    )
  }

  async function deleteProject(id: string) {
    await $fetch<Project>(`/api/projects/${id}/delete`, {
      method: 'DELETE',
    })
  }

  // async function progressProject(projectId: string) {
  //   await useTasksStore.fetchAll(projectId)
  //
  // }

  return {
    projects,
    isLoading,
    fetchAll,
    myFetch,
    createProject,
    searchProjects,
    updateProject,
    deleteProject,
    // progressProject
  }
})
