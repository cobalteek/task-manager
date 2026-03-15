import type {Project} from "../types/project";
import {formatForDateTimeLocal} from "../utils/formatDate";
import type {Task} from "../types/task";
import type {Form} from "../types/form";
import {ref} from 'vue'
import {createError} from "h3";

export function useProjectTaskForm() {
  const form = ref<Form>({
    title: '',
    description: '',
    deadline: '',
    handlerId: ''
  })

  function resetForm() {
    form.value = {
      title: '',
      description: '',
      deadline: '',
      handlerId: ''
    }
  }

  function fillFromProject(project: Project) {
    form.value = {
      title: project.title ?? '',
      description: project.description ?? '',
      deadline: project.deadline ? formatForDateTimeLocal(project.deadline) : '',
      handlerId: project.handlerId ?? '',
    }
  }

  function fillFromTask(task: Task) {
    form.value = {
      title: task.title ?? '',
      description: task.description ?? '',
      deadline: task.deadline ? formatForDateTimeLocal(task.deadline) : '',
      handlerId: task.handlerId ?? ''
    }
  }

  function validateDeadline(deadline: string) {
    if (!deadline) return null

    const date = new Date(deadline + ':00')
    const now = Date.now() + 60_000

    if (date.getTime() < now) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Deadline is too early'
      })
    }

    return date
  }

  return {
    form,
    resetForm,
    fillFromProject,
    fillFromTask,
    validateDeadline
  }

}

export type ProjectTaskFormApi = ReturnType<typeof useProjectTaskForm>
