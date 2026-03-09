import {defineStore} from 'pinia'
import {ref} from "vue"
import type {Project} from '~~/types/project'

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

  async function searchProjects(query: string) {
    projects.value = await $fetch<Project[]>(
      `/api/projects/projectSearch?q=${encodeURIComponent(query)}`
    )
  }

  async function createProject(title: string, description: string, deadline: Date | null) {
    const created = await $fetch<Project>('/api/projects/projects', {
      method: 'POST',
      body: {title, description, deadline}
    })

    projects.value.unshift(created)
    return created
  }

  async function updateProject(project: Project) {

    const updated = await $fetch<Project>(`/api/projects/${project.id}/projects`, {
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

  return {
    projects,
    isLoading,
    fetchAll,
    createProject,
    searchProjects,
    updateProject,
    deleteProject
  }
})
