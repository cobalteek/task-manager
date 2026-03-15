<script setup lang="ts">
import { useProjectsStore } from "~/stores/projects"
import { storeToRefs } from "pinia"
import type { Project } from "~~/types/project"
import AddOrEditModalContent from "~/components/AddOrEditModalContent.vue"
import { hasAccess } from "~~/utils/hasAccess"
import InfoModalContent from "~/components/InfoModalContent.vue";
import {useProjectTaskForm} from "~~/composables/useProjectTaskForm";

defineProps<{ modelValue: boolean }>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'toggleTasks', v: Project): void
}>()

const selectedProject = ref<Project | undefined>(undefined)

const modalOpen = ref(false)
const projectInfo = ref(false)
const modalError = ref(false)
const allProjects = ref(true)

const mode = ref<'create-task' | 'edit-task' | 'create-project' | 'edit-project' | ''>('')

const textError = ref('')
const query = ref('')
const type_ = ref('')

const projectsStore = useProjectsStore()
const { projects, isLoading } = storeToRefs(projectsStore)
const auth = useAuthStore()
const {user} = storeToRefs(auth)
const formApi = useProjectTaskForm()

onMounted(async () => {
  await allFetch()
})

watch(query, async (v) => {
  try {
    await projectsStore.searchProjects(v)
  } catch (e: any) {
    type_.value = 'info'
    textError.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      $t('error.project.searchFailed')
    modalError.value = true
  }
})

function close() {
  emit('update:modelValue', false)
}

function onAdd() {
  mode.value = 'create-project'
  selectedProject.value = undefined
  modalOpen.value = true
}

function onEdit(project: Project) {
  if (hasAccess({project, roles: ['owner']})) {
    mode.value = 'edit-project'
    selectedProject.value = project
    modalOpen.value = true
    return
  }
  textError.value = $t('error.user.hasAccess')
  modalError.value = true
}

function projectOpen(project: Project) {
  selectedProject.value = project
  projectInfo.value = true
}

async function allFetch() {
  try {
    allProjects.value = true
    await projectsStore.fetchAll()
  } catch (e: any) {
    type_.value = 'error'
    textError.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      $t('error.project.fetchAll')
  }
}

async function myFetch() {
  try {
    allProjects.value = false
    await projectsStore.myFetch()
  } catch (e: any) {
    type_.value = 'error'
    textError.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      $t('error.project.fetchMy')
  }
}

const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  project: null as Project | null
})

const menuItems = computed(() => [
  { label: 'Открыть', key: 'open' },
  { label: 'Посмотреть задачи', key: 'tasks' },
  {
    label: 'Редактировать',
    key: 'edit',
    disabled: user.value?.role === 'user'
  }
])

function openContextMenu(project: Project, event: MouseEvent) {
  event.preventDefault()

  contextMenu.value.visible = true
  contextMenu.value.x = event.clientX
  contextMenu.value.y = event.clientY
  contextMenu.value.project = project
}

function showTasks(project: Project) {
  emit('toggleTasks', project)
}

function handleContextAction(key: string) {
  const project = contextMenu.value.project
  if (!project) return

  switch (key) {
    case 'open':
      projectOpen(project)
      break
    case 'tasks':
      showTasks(project)
      break
    case 'edit':
      onEdit(project)
      break
  }
}
</script>

<template>
  <div
    v-if="modelValue"
    class="w-full border border-solid border-gray-100 rounded-md h-[50vh] overflow-x-hidden hide-scrollbar max-w-[1500px]"
  >
    <TablesProjectsToolbar
      :query="query"
      :all-projects="allProjects"
      @update:query="query = $event"
      @all="allFetch"
      @my="myFetch"
      @add="onAdd"
      @close="close"
    />

    <hr class="my-1 w-full">

    <TablesProjectsTable
      :projects="projects"
      :is-loading="isLoading"
      @open="projectOpen"
      @openContextMenu="openContextMenu"
    />
    <ClientOnly>
      <ContextMenu
        v-model="contextMenu.visible"
        :x="contextMenu.x"
        :y="contextMenu.y"
        :items="menuItems"
        @select="handleContextAction"
      />
    </ClientOnly>

    <AddOrEditModalContent
      v-model="modalOpen"
      :mode="mode"
      :sort="allProjects"
      :project="selectedProject"
      :form-api="formApi"
    />

    <InfoModalContent
      v-if="selectedProject"
      v-model="projectInfo"
      :project="selectedProject"
    />

    <ErrorModalContent
      v-model="modalError"
      type="error"
      :text="textError"
    />
  </div>
</template>
