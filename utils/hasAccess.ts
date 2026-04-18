import type {Project} from "~~/types/project"
import {useAuthStore} from "~/stores/auth"
import {storeToRefs} from "pinia"
import type {Task} from "~~/types/task"

export function hasAccess(
  {
    project, task,
    roles = []
  }: {
    project?: Project
    task?: Task
    roles?: string[]
  }) {
  let handlerId: string | undefined

  if (project) {
    handlerId = project.handlerId
  } else if (task) {
    handlerId = task.handlerId
  }

  const auth = useAuthStore()
  const {user} = storeToRefs(auth)

  return (
    handlerId === user.value?.id ||
    roles.includes(user.value?.role ?? '')
  )
}
