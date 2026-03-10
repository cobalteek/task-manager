<script setup lang="ts">
import {useStatusesStore} from "~/stores/statuses";
import {useProjectsStore} from "~/stores/projects";
import type {Project} from "~~/types/project";

defineProps<{
  project: Project
  disabled?: boolean
}>()

const statusesStore = useStatusesStore()
const projectsStore = useProjectsStore()

const type_ = ref('')
const textError = ref('')
const modalError = ref(false)

onMounted(async () => {
  try {
    await statusesStore.fetchAll()
  } catch (e: any) {
    type_.value = 'info'
    textError.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      'Failed to fetch projects'
    modalError.value = true
    return
  }
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
      :value="project.statusId ? project.statusId : textError"
      class="select w-[150px]">
      <option
        v-for="o in statusesStore.options"
        :key="o.value"
        :value="o.value"
      >
        {{ $t(`status.${o.label}`) }}
      </option>
    </select>
  </div>
  <ErrorModalContent
    v-model="modalError"
    :text="textError"
    :type="type_"
  />
</template>
