<script setup lang="ts">
import { useStatusesStore } from "~/stores/statuses";
import { useProjectsStore } from "~/stores/projects";
import type {Project} from "~~/types/project";

defineProps<{
  project: Project
  disabled?: boolean
}>()

const statusesStore = useStatusesStore()
const projectsStore = useProjectsStore()

onMounted(async () => {
  await statusesStore.fetchAll()
})

async function onStatusChange(projectId: string, statusId: number) {
  await statusesStore.updateStatus(projectId, statusId)
  await projectsStore.fetchAll()
}
</script>

<template>
  <div class="min-w-[50px] max-w-[300px] text-center">
    <select
      :disabled=disabled
      @change="onStatusChange(project.id, Number(($event.target as HTMLSelectElement).value))"
      :value="project.statusId"
      class="text-gray-100 bg-[var(--bg-context)] rounded-md p-1 border border-gray-100 w-[150px]">
      <option
        v-for="o in statusesStore.options"
        :key="o.value"
        :value="o.value"
      >
        {{ o.label }}
      </option>
    </select>
  </div>
</template>
