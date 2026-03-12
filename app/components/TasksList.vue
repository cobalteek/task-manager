<script setup lang="ts">
import {useTasksStore} from "~/stores/tasks"
import {storeToRefs} from "pinia"
import type {Task} from "~~/types/task"
import AddOrEditModalContent from "~/components/AddOrEditModalContent.vue"
import {hasAccess} from "~~/utils/hasAccess"
import InfoModalContent from "~/components/InfoModalContent.vue";

defineProps<{ modelValue: boolean }>()

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const selectedTask = ref<Task | undefined>(undefined)

const modalOpen = ref(false)
const taskInfo = ref(false)
const modalError = ref(false)
const allTasks = ref(true)

const textError = ref('')
const query = ref('')
const type_ = ref('')

const tasksStore = useTasksStore()
const { tasks, isLoading } = storeToRefs(tasksStore)

onMounted(async () => {
  await allFetch()
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
  selectedTask.value = undefined
  modalOpen.value = true
}

function onEdit(task: Task) {
  if (hasAccess({task, roles:['admin']})) {
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
    await tasksStore.fetchAll()
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
    await tasksStore.myFetch()
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
      :all-tasks="allTasks"
      @update:query="query = $event"
      @all="allFetch"
      @my="myFetch"
      @add="onAdd"
      @close="close"
    />

    <hr class="my-1 w-full">

    <TablesTasksTable
      :tasks="tasks"
      :is-loading="isLoading"
      @open="taskOpen"
      @edit="onEdit"
    />

    <AddOrEditModalContent
      v-model="modalOpen"
      :sort="allTasks"
      :task="selectedTask"
    />

    <InfoModalContent
      v-if="selectedTask"
      v-model="taskInfo"
      :task="selectedTask"
    />

    <ErrorModalContent
      v-model="modalError"
      type="error"
      :text="textError"
    />
  </div>
</template>
