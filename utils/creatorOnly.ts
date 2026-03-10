import type {Project} from "../types/project";
import {useAuthStore} from "~~/app/stores/auth";
import {storeToRefs} from "pinia";

export function creatorOnly(project: Project) {
  const auth = useAuthStore()
  const {user} = storeToRefs(auth)
  return project.createdById == user.value?.id || user.value?.role == 'owner';

}
