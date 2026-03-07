import { defineStore } from 'pinia'
import { ref } from "vue"
import type { Project } from '~~/types/project'

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
    try {
      projects.value = await $fetch<Project[]>(
        `/api/projects/projectSearch?q=${encodeURIComponent(query)}`
      )
    } catch (error) {
      console.error(error)
    }
  }

  async function createProject(title: string, description: string, deadline: Date | null) {
    try {
      const created = await $fetch<Project>('/api/projects/projects', {
        method: 'POST',
        body: { title, description, deadline }
      })

      projects.value.unshift(created)
      return created
    } catch (e) {
      console.error(e)
      throw createError({
        statusCode: 402,
        statusMessage: "Create project if failed"
      })
    }
  }

  async function updateProject(project: Project) {
    try {
      const updated = await $fetch<Project>(`/api/projects/${project.id}/projects`, {
        method: 'PATCH',
        body: project,
      })

      projects.value = projects.value.map(p =>
        p.id === updated.id ? updated : p
      )
    } catch (e) {
      console.error(e)
    }
  }

  async function deleteProject(id: string) {
    try {
      await $fetch<Project>(`/api/projects/${id}/delete`, {
        method: 'DELETE',
      })
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: "Delete Project unable"
      })
    }
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
