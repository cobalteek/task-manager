import type {Project} from "~~/types/project"
import {useAuthStore} from "~/stores/auth"
import {storeToRefs} from "pinia"
import type {Task} from "~~/types/task";

export function hasAccess(
  {
    project,
    task,
    roles = []
  }: {
    project?: Project
    task?: Task
    roles?: string[]
  }) {
  const obj = ref()
  if (project) {
    obj.value = project.handlerId
  } else if (task) {
    obj.value = task.handlerId
  }

  const auth = useAuthStore()
  const {user} = storeToRefs(auth)

  return (
    obj.value === user.value?.id ||
    roles.includes(user.value?.role ?? '')
  )
}
