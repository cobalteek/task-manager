<script setup lang="ts">
import { useProjectsStore } from "~/stores/projects"
import { storeToRefs } from "pinia"
import type { Project } from "~~/types/project"
import AddOrEditModalContent from "~/components/AddOrEditModalContent.vue"
import { hasAccess } from "~~/utils/hasAccess"
import InfoModalContent from "~/components/InfoModalContent.vue"
import { useProjectTaskForm } from "~~/composables/useProjectTaskForm"

defineProps<{ modelValue: boolean }>()

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void
  (e: "toggleTasks", v: Project): void
}>()

const selectedProject = ref<Project | undefined>(undefined)

const modalOpen = ref(false)
const projectInfo = ref(false)
const modalError = ref(false)
const allProjects = ref(true)

const mode = ref<
  "create-task" | "edit-task" | "create-project" | "edit-project" | ""
>("")

const textError = ref("")
const query = ref("")
const type_ = ref("")

const projectsStore = useProjectsStore()
const { projects, isLoading } = storeToRefs(projectsStore)

const auth = useAuthStore()
const { user } = storeToRefs(auth)

const formApi = useProjectTaskForm()

onMounted(async () => {
  await allFetch()
})

watch(query, async (v) => {
  try {
    await projectsStore.searchProjects(v)
  } catch (e: any) {
    type_.value = "info"
    textError.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      $t("error.project.searchFailed")
    modalError.value = true
  }
})

function close() {
  emit("update:modelValue", false)
}

function onAdd() {
  mode.value = "create-project"
  selectedProject.value = undefined
  modalOpen.value = true
}

function onEdit(project: Project) {
  if (hasAccess({ project, roles: ["owner"] })) {
    mode.value = "edit-project"
    selectedProject.value = project
    modalOpen.value = true
    return
  }

  type_.value = "error"
  textError.value = $t("error.user.hasAccess")
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
    type_.value = "error"
    textError.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      $t("error.project.fetchAll")
    modalError.value = true
  }
}

async function myFetch() {
  try {
    allProjects.value = false
    await projectsStore.myFetch()
  } catch (e: any) {
    type_.value = "error"
    textError.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      $t("error.project.fetchMy")
    modalError.value = true
  }
}

const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  project: null as Project | null
})

const menuItems = computed(() => [
  { label: $t("contextMenu.open"), key: "open" },
  { label: $t("contextMenu.viewTasks"), key: "tasks" },
  {
    label: $t("contextMenu.edit"),
    key: "edit",
    disabled: user.value?.role === "user"
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
  emit("toggleTasks", project)
}

function handleContextAction(key: string) {
  const project = contextMenu.value.project
  if (!project) return

  switch (key) {
    case "open":
      projectOpen(project)
      break
    case "tasks":
      showTasks(project)
      break
    case "edit":
      onEdit(project)
      break
  }

  contextMenu.value.visible = false
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
      border border-solid border-gray-200
      overflow-hidden

      h-[calc(100dvh-100px)]
      min-h-[420px]

      sm:h-[70dvh]
      lg:h-[75vh]
    "
  >
    <div class="flex h-full flex-col">
      <div class="shrink-0 px-2 py-2 sm:px-3 sm:py-3 lg:px-4">
        <TablesProjectsToolbar
          :query="query"
          :all-projects="allProjects"
          @update:query="query = $event"
          @all="allFetch"
          @my="myFetch"
          @add="onAdd"
          @close="close"
        />
      </div>

      <hr class="w-full border-gray-200" />

      <div class="min-h-0 flex-1 overflow-hidden">
        <div class="h-full overflow-auto px-1 sm:px-2 lg:px-3 hide-scrollbar">
          <TablesProjectsTable
            :projects="projects"
            :is-loading="isLoading"
            @open="projectOpen"
            @openContextMenu="openContextMenu"
          />
        </div>
      </div>
    </div>

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
      :type="type_ || 'error'"
      :text="textError"
    />
  </div>
</template>
