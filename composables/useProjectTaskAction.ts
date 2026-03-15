import type {Project} from "../types/project";
import type {Task} from "../types/task";
import {type ProjectTaskFormApi} from "./useProjectTaskForm";
import {useProjectsStore} from '~/stores/projects'
import {useTasksStore} from '~/stores/tasks'

type Mode = 'create-project' | 'edit-project' | 'create-task' | 'edit-task' | ''

type PropsLike = {
  mode: Mode
  project?: Project
  task?: Task
  sort: boolean
  formApi: ProjectTaskFormApi
}

export function useProjectTaskAction(
  props: PropsLike,
) {

  const projectStore = useProjectsStore()
  const tasksStore = useTasksStore()
  const loading = ref(false)

  async function submit(props: PropsLike, formApi: ProjectTaskFormApi) {
    if (!props.formApi.form.value) return
    if (props.mode === 'create-project') {
      loading.value = true
      console.log('Creating project...')
      await projectStore.createProject(
        formApi.form.value.title,
        formApi.form.value.description,
        formApi.validateDeadline(formApi.form.value.deadline ? formApi.form.value.deadline : ''),
        formApi.form.value.handlerId
      )
      if (props.sort) {
        await projectStore.fetchAll()
      } else await projectStore.myFetch()
      loading.value = false
      return
    }
    if (!props.project) return
    if (props.mode === 'edit-project') {
      loading.value = true
      await projectStore.updateProject({
        ...props.project,
        title: formApi.form.value.title,
        description: formApi.form.value.description,
        deadline: formApi.form.value.deadline || null,
        handlerId: formApi.form.value.handlerId
      })
      if (props.sort) {
        await projectStore.fetchAll()
      } else await projectStore.myFetch()
      loading.value = false
      return
    }

    if (props.mode === 'create-task') {
      loading.value = true
      await tasksStore.createTask(
        props.project.id,
        formApi.form.value.title,
        formApi.form.value.description,
        formApi.validateDeadline(formApi.form.value.deadline ? formApi.form.value.deadline : ''),
        formApi.form.value.handlerId
      )
      if (props.sort) {
        await tasksStore.fetchAll(props.project.id)
      } else await tasksStore.myFetch(props.project.id)
      loading.value = false
      return
    }
    if (props.mode === 'edit-task') {
      if (!props.task) return
      loading.value = true
      await tasksStore.updateTask(props.project.id, {
        ...props.task,
        title: formApi.form.value.title,
        description: formApi.form.value.description,
        deadline: formApi.form.value.deadline || null,
        handlerId: formApi.form.value.handlerId
      })
      if (props.sort) {
        await tasksStore.fetchAll(props.project.id)
      } else await tasksStore.myFetch(props.project.id)
      loading.value = false
      return
    }
  }

  async function deleteItem(props: PropsLike) {
    if (props.task && props.project) {
      await tasksStore.deleteTask(props.project.id, props.task.id)
      if (props.sort) {
        await tasksStore.fetchAll(props.project.id)
      } else await tasksStore.myFetch(props.project.id)
    } else if (props.project) {
      await projectStore.deleteProject(props.project.id)
      if (props.sort) {
        await projectStore.fetchAll()
      } else await projectStore.myFetch()
    }
  }

  return {
    submit,
    deleteItem,
  }
}
