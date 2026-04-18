<script setup lang="ts">
import { useTasksStore } from "~/stores/tasks"
import { storeToRefs } from "pinia"
import type { Task } from "~~/types/task"
import type { Project } from "~~/types/project"
import AddOrEditModalContent from "~/components/AddOrEditModalContent.vue"
import InfoModalContent from "~/components/InfoModalContent.vue"
import { hasAccess } from "~~/utils/hasAccess"
import { useProjectTaskForm } from "~~/composables/useProjectTaskForm"
import {useProjectsStore} from "~/stores/projects";

const props = defineProps<{
  modelValue: boolean
  project: Project
}>()

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void
}>()

const selectedTask = ref<Task | undefined>(undefined)

const modalOpen = ref(false)
const taskInfo = ref(false)
const modalError = ref(false)
const allTasks = ref(true)

const mode = ref<"create-task" | "edit-task" | "create-project" | "edit-project">(
  "create-task"
)

const prjStore = useProjectsStore()

const textError = ref("")
const query = ref("")
const type_ = ref("")

const tasksStore = useTasksStore()
const { tasks, isLoading } = storeToRefs(tasksStore)
const formApi = useProjectTaskForm()

onMounted(async () => {
  await tasksStore.fetchAll(props.project.id)
})

watch(query, async (v) => {
  try {
    await tasksStore.searchTasks(v)
  } catch (e: any) {
    type_.value = "info"
    textError.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      $t("error.task.searchFailed")
    modalError.value = true
  }
})

function close() {
  emit("update:modelValue", false)
}

function onAdd() {
  mode.value = "create-task"
  selectedTask.value = undefined
  modalOpen.value = true
}

function onEdit(task: Task) {
  if (hasAccess({ task, roles: ["admin", "owner"] })) {
    mode.value = "edit-task"
    selectedTask.value = task
    modalOpen.value = true
    return
  }

  type_.value = "error"
  textError.value = $t("error.user.hasAccess")
  modalError.value = true
}

function taskOpen(task: Task) {
  selectedTask.value = task
  taskInfo.value = true
}

async function allFetch() {
  try {
    allTasks.value = true
    await tasksStore.fetchAll(props.project.id)
  } catch (e: any) {
    type_.value = "error"
    textError.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      $t("error.task.fetchAll")
    modalError.value = true
  }
}

async function myFetch() {
  try {
    allTasks.value = false
    await tasksStore.myFetch(props.project.id)
  } catch (e: any) {
    type_.value = "error"
    textError.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      $t("error.task.fetchMy")
    modalError.value = true
  }
}
</script>

<template>
  <div
    v-if="modelValue"
    class="
      w-full
      max-w-[1500px]
      mx-auto
      rounded-xl
      border border-solid border-[var(--bg-main)]
      overflow-hidden

      min-h-[420px]
      max-h-[80vh]
      bg-[var(--bg-modal)]
    "
  >
    <div class="flex h-full flex-col">
      <div class="shrink-0 px-2 py-2 sm:px-3 sm:py-3 lg:px-4">
        <TablesTasksToolbar
          :query="query"
          :allTasks="allTasks"
          @update:query="query = $event"
          @all="allFetch"
          @my="myFetch"
          @add="onAdd"
          @close="close"
        />
      </div>

      <hr class="w-full my-1" />

      <div class="min-h-0 flex-1 overflow-hidden">
        <div class="h-full overflow-auto px-1 sm:px-2 lg:px-3 hide-scrollbar">
          <TablesTasksTable
            :project="project"
            :tasks="tasks"
            :is-loading="isLoading"
            @open="taskOpen"
            @edit="onEdit"
          />
        </div>
      </div>
    </div>

    <AddOrEditModalContent
      v-model="modalOpen"
      :mode="mode"
      :sort="allTasks"
      :project="project"
      :task="selectedTask"
      :form-api="formApi"
    />

    <InfoModalContent
      v-if="selectedTask"
      v-model="taskInfo"
      :project="project"
      :task="selectedTask"
    />

    <ErrorModalContent
      v-model="modalError"
      :type="type_ || 'error'"
      :text="textError"
    />
  </div>
</template>
