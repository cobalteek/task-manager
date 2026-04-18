<script setup lang="ts">
import { useStatusesStore } from "~/stores/statuses"
import { useProjectsStore } from "~/stores/projects"
import { useTasksStore } from "~/stores/tasks"
import type { Project } from "~~/types/project"
import type { Task } from "~~/types/task"

const props = defineProps<{
  project: Project
  task?: Task
  disabled?: boolean
}>()

const statusesStore = useStatusesStore()
const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()

const entityId = computed(() => props.task?.id ?? props.project?.id ?? '')
const currentStatusId = computed(() => props.task?.statusId ?? props.project?.statusId ?? null)

const type_ = ref('')
const textError = ref('')
const modalError = ref(false)
const progress = ref<number>(0)
const isSyncingAutoStatus = ref(false)

const manualStatusId = ref<number | null>(null)
const manualStatusProgress = ref<number | null>(null)

onMounted(async () => {
  try {
    await statusesStore.fetchAll()
    progress.value = await projectsStore.progressProject(props.project.id)

    if (!props.task && [4, 5].includes(props.project.statusId)) {
      manualStatusId.value = props.project.statusId
      manualStatusProgress.value = progress.value
    }

    await syncProjectAutoStatus()
  } catch (e: any) {
    type_.value = 'info'
    textError.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      'Failed to fetch projects'
    modalError.value = true
  }
})

function getAutoStatusId(progressValue: number) {
  if (progressValue === 100) return 3
  if (progressValue >= 1 && progressValue <= 99) return 2
  return 1
}

async function syncProjectStatusByProgress(force = false) {
  const newProgress = await projectsStore.progressProject(props.project.id)
  progress.value = newProgress

  const nextStatusId = getAutoStatusId(newProgress)

  if (!force && props.project.statusId === nextStatusId) {
    return
  }

  await statusesStore.updateProjectStatus(props.project.id, nextStatusId)
  props.project.statusId = nextStatusId

  manualStatusId.value = null
  manualStatusProgress.value = null
}

async function syncProjectAutoStatus() {
  if (props.task) return
  if (isSyncingAutoStatus.value) return

  const autoStatusId = getAutoStatusId(progress.value)

  // 100% всегда завершён
  if (progress.value === 100) {
    manualStatusId.value = null
    manualStatusProgress.value = null

    if (props.project.statusId === 3) return

    try {
      isSyncingAutoStatus.value = true
      await statusesStore.updateProjectStatus(props.project.id, 3)
      props.project.statusId = 3
    } catch (e: any) {
      type_.value = 'error'
      textError.value =
        e?.data?.statusMessage ||
        e?.data?.message ||
        e?.message ||
        'Failed to sync project status'
      modalError.value = true
    } finally {
      isSyncingAutoStatus.value = false
    }

    return
  }

  if (
    manualStatusId.value &&
    manualStatusProgress.value === progress.value
  ) {
    return
  }

  if (
    manualStatusId.value &&
    manualStatusProgress.value !== progress.value
  ) {
    manualStatusId.value = null
    manualStatusProgress.value = null
  }

  if (props.project.statusId === autoStatusId) {
    return
  }

  try {
    isSyncingAutoStatus.value = true
    await statusesStore.updateProjectStatus(props.project.id, autoStatusId)
    props.project.statusId = autoStatusId
  } catch (e: any) {
    type_.value = 'error'
    textError.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      'Failed to sync project status'
    modalError.value = true
  } finally {
    isSyncingAutoStatus.value = false
  }
}

async function onStatusChange(statusId: number) {
  if (!entityId.value) return

  try {
    if (props.task) {
      await statusesStore.updateTaskStatus(props.project.id, props.task, statusId)
      await tasksStore.fetchAll(props.project.id)

      await syncProjectStatusByProgress(true)
      return
    }

    if (![4, 5].includes(statusId)) {
      return
    }

    await statusesStore.updateProjectStatus(props.project.id, statusId)
    props.project.statusId = statusId

    manualStatusId.value = statusId
    manualStatusProgress.value = progress.value

    await projectsStore.fetchAll()
  } catch (e: any) {
    type_.value = 'error'
    textError.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      'Failed to update status'
    modalError.value = true
  }
}

function isStatusDisabled(statusValue: number) {
  if (props.task) {
    return false
  }

  const current = effectiveStatusId.value

  if (current === 2) {
    return ![2, 4, 5].includes(statusValue)
  }

  if (current === 4) {
    return ![2, 4, 5].includes(statusValue)
  }

  if (current === 5) {
    return ![2, 4, 5].includes(statusValue)
  }

  return ![4, 5].includes(statusValue)
}

const effectiveStatusId = computed(() => {
  if (props.task) {
    return currentStatusId.value
  }

  if (progress.value === 100) {
    return 3
  }

  if (
    manualStatusId.value &&
    manualStatusProgress.value === progress.value
  ) {
    return manualStatusId.value
  }

  return getAutoStatusId(progress.value)
})

const selectedLabel = computed(() => {
  const current = statusesStore.options.find(o => o.value === effectiveStatusId.value)

  if (!current) {
    return textError.value
  }

  const base = $t(`status.${current.label}`)

  if (props.task) {
    return base
  }

  return current.value !== 1 && current.value !== 3
    ? `${base} ${progress.value}%`
    : base
})

watch(
  () => props.project.id,
  async () => {
    if (props.task) return

    progress.value = await projectsStore.progressProject(props.project.id)

    if ([4, 5].includes(props.project.statusId)) {
      manualStatusId.value = props.project.statusId
      manualStatusProgress.value = progress.value
    } else {
      manualStatusId.value = null
      manualStatusProgress.value = null
    }

    await syncProjectAutoStatus()
  }
)

watch(
  progress,
  async () => {
    await syncProjectAutoStatus()
  }
)
</script>

<template>
  <div class="min-w-[50px] max-w-[300px] text-center">
    <div class="relative inline-block w-[180px]">
      <select
        :disabled="disabled"
        :value="effectiveStatusId"
        class="select w-[170px] text-transparent"
        @change="onStatusChange(Number(($event.target as HTMLSelectElement).value))"
      >
        <option
          v-for="o in statusesStore.options"
          :key="o.value"
          :value="o.value"
          :disabled="isStatusDisabled(o.value)"
        >
          {{ $t(`status.${o.label}`) }}
        </option>
      </select>

      <span
        class="pointer-events-none select-none absolute inset-y-0 left-3 right-10 flex items-center truncate text-[var(--text-main)]"
      >
        {{ selectedLabel }}
      </span>
    </div>
  </div>

  <ErrorModalContent
    v-model="modalError"
    :text="textError"
    :type="type_"
  />
</template>

<style scoped>
select {
  -webkit-text-fill-color: transparent;
}
</style>
