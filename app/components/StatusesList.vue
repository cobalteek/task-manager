<script setup lang="ts">
import {useStatusesStore} from "~/stores/statuses";
import {useProjectsStore} from "~/stores/projects";
import type {Project} from "~~/types/project";
import type {Task} from "~~/types/task";

const props = defineProps<{
  project: Project
  task?: Task
  disabled?: boolean
}>()

const statusesStore = useStatusesStore()
const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()

const entityId = computed(() => props.task?.id ? props.task?.id : props.project?.id)
const currentStatusId = computed(() => props.task?.statusId ? props.task?.statusId : props.project?.statusId)


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

async function onStatusChange(statusId: number) {
  if(!entityId) return
  if(props.task) {
    await statusesStore.updateTaskStatus(props.project.id, props.task, statusId)
    await tasksStore.fetchAll(props.project.id)
  } else {
    await statusesStore.updateProjectStatus(props.project.id, statusId)
    await projectsStore.fetchAll()
  }
}
</script>

<template>
  <div class="min-w-[50px] max-w-[300px] text-center">
    <select
      :disabled=disabled
      @change="onStatusChange(Number(($event.target as HTMLSelectElement).value))"
      :value="currentStatusId ? currentStatusId : textError"
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
