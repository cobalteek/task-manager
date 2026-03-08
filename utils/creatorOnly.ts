import type {Project} from "../types/project";
import {useAuthStore} from "~~/app/stores/auth";
import {storeToRefs} from "pinia";

export function creatorOnly(project: Project) {
  const auth = useAuthStore()
  const { user } = storeToRefs(auth)
  if (project.createdById == user.value?.id) {
    return true
  }
  console.error("Only the creator of the project can do it.")
  return false
}
