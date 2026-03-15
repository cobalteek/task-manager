<script setup lang="ts">
import {useTasksStore} from "~/stores/tasks"
import {storeToRefs} from "pinia"
import type {Task} from "~~/types/task"
import AddOrEditModalContent from "~/components/AddOrEditModalContent.vue"
import {hasAccess} from "~~/utils/hasAccess"
import InfoModalContent from "~/components/InfoModalContent.vue";
import type {Project} from "~~/types/project";
import {useProjectTaskForm} from "~~/composables/useProjectTaskForm";

const props = defineProps<{
  modelValue: boolean
  project: Project
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const selectedTask = ref<Task | undefined>(undefined)

const modalOpen = ref(false)
const taskInfo = ref(false)
const modalError = ref(false)
const allTasks = ref(true)
const mode = ref<'create-task' | 'edit-task' | 'create-project' | 'edit-project'>('create-task')

const textError = ref('')
const query = ref('')
const type_ = ref('')

const tasksStore = useTasksStore()
const {tasks, isLoading} = storeToRefs(tasksStore)
const formApi = useProjectTaskForm()

onMounted(async () => {
  await tasksStore.fetchAll(props.project.id)
})

watch(query, async (v) => {
  try {
    await tasksStore.searchTasks(v)
  } catch (e: any) {
    type_.value = 'info'
    textError.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      $t('error.task.searchFailed')
    modalError.value = true
  }
})

function close() {
  emit('update:modelValue', false)
}

function onAdd() {
  mode.value = 'create-task'
  selectedTask.value = undefined
  modalOpen.value = true
}

function onEdit(task: Task) {
  if (hasAccess({task, roles: ['admin', 'owner']})) {
    mode.value = 'edit-task'
    selectedTask.value = task
    modalOpen.value = true
    return
  }

  textError.value = $t('error.user.hasAccess')
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
    type_.value = 'error'
    textError.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      $t('error.task.fetchAll')
  }
}

async function myFetch() {
  try {
    allTasks.value = false
    await tasksStore.myFetch(props.project.id)
  } catch (e: any) {
    type_.value = 'error'
    textError.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      $t('error.task.fetchMy')
  }
}
</script>

<template>
  <div
    v-if="modelValue"
    class="w-full border border-solid border-gray-100 rounded-md h-[50vh] overflow-x-hidden hide-scrollbar max-w-[1500px]"
  >
    <TablesTasksToolbar
      :query="query"
      :allTasks="allTasks"
      @update:query="query = $event"
      @all="allFetch"
      @my="myFetch"
      @add="onAdd"
      @close="close"
    />

    <hr class="my-1 w-full">

    <TablesTasksTable
      :project="project"
      :tasks="tasks"
      :is-loading="isLoading"
      @open="taskOpen"
      @edit="onEdit"
    />

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
      type="error"
      :text="textError"
    />
  </div>
</template>
