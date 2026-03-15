import {watch} from 'vue'
import type {Project} from '../types/project'
import type {Task} from '../types/task'
import type {useUsersStore} from '../app/stores/users'
import {useProjectTaskForm} from "./useProjectTaskForm";

type Mode = 'create-project' | 'edit-project' | 'create-task' | 'edit-task' | ''

type PropsLike = {
  mode: Mode
  project?: Project
  task?: Task
}
type ProjectTaskFormApi = ReturnType<typeof useProjectTaskForm>


export function useProjectTaskModalState(
  props: PropsLike,
  usersStore: ReturnType<typeof useUsersStore>,
  formApi: Pick<ProjectTaskFormApi, 'resetForm' | 'fillFromProject' | 'fillFromTask'>
) {
  const {resetForm, fillFromProject, fillFromTask} = formApi

  watch(
    [() => props.mode, () => props.project, () => props.task],
    async () => {
      resetForm()

      if (props.mode === 'create-project') {
        await usersStore.fetchUsers('admin')
        return
      }

      if (props.mode === 'create-task') {
        await usersStore.fetchUsers('user')
        return
      }

      if (props.mode === 'edit-project' && props.project) {
        fillFromProject(props.project)

        await usersStore.fetchUsers('admin')
        return
      }

      if (props.mode === 'edit-task' && props.task) {
        fillFromTask(props.task)

        await usersStore.fetchUsers('user')
      }
    },
    {immediate: true}
  )

}
