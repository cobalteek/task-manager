<script setup lang="ts">
import type {Project} from "~~/types/project";
import {useStatusesStore} from "~/stores/statuses";
import AddOrEditProjectModalContent from "~/components/AddOrEditProjectModalContent.vue";
import {useProjectsStore} from "~/stores/projects";

defineProps<{ modelValue: boolean }>()

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const query = ref('')
const modalOpen = ref(false)
const selectedProject = ref<Project | undefined>(undefined)
const projectInfo = ref(false)

const statusesStore = useStatusesStore()
const projectsStore = useProjectsStore()

const { projects } = storeToRefs(projectsStore)

onMounted(async () => {
  await projectsStore.fetchAll()
  await statusesStore.fetchAll()
})

watch(query, async (v) => {
  await projectsStore.searchProjects(v)
})

function close() {
  emit('update:modelValue', false)
}

function formatDate(value: string | null) {
  if (!value) return '—'
  const d = new Date(value)
  return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

async function onStatusChange(projectId: string, statusId: number) {
  await statusesStore.updateStatus(projectId, statusId)
  await projectsStore.fetchAll()
}

function onAdd() {
  selectedProject.value = undefined
  modalOpen.value = true
}

function onEdit(project: Project) {
  selectedProject.value = project
  modalOpen.value = true
}

function projectOpen(project: Project) {
  selectedProject.value = project
  projectInfo.value = true
}

</script>

<template>
    <div class="w-full border border-solid border-gray-100 rounded-md h-[50vh] overflow-x-hidden hide-scrollbar max-w-[1500px]" v-if="modelValue" @update:model-value="emit('update:modelValue', $event)">
      <div class="relative">
        <div class="w-full inline-flex justify-center pt-1 lg:justify-end">
          <div class="flex items-center gap-3">
            <button
              @click="onAdd"
              class="p-3 text-shadow border border-solid border-gray-100 rounded-md"
            >
              Add
            </button>
            <div class="ml-1 relative inline-block mr-1">
              <input
                v-model="query"
                class="focus:outline-none text-black rounded-xl p-1"
                placeholder="Search"
              >
              <img alt="search logo" src="../assets/search16.svg" class="absolute right-2 top-1/2 -translate-y-1/2">
            </div>
          </div>
          <button @click="close" class="p-3 text-shadow text-2xl mb-2 ">
            ×
          </button>
        </div>
      </div>
      <hr class="my-1 w-full">
      <div>
        <div class="overflow-x-auto hide-scrollbar max-w-[1500px]">
          <div class="grid grid-flow-col grid-cols-[repeat(6,minmax(200px,1fr))] gap-6 pt-1 my-3 text-center w-full">
            <div>
              Title
            </div>
            <div>
              Description
            </div>
            <div>
              Created At
            </div>
            <div>
              Deadline
            </div>
            <div>
              Status
            </div>
            <div>
              Created By
            </div>
          </div>
          <div>
            <div
              v-for="prj in projects"
              :key="prj?.id"
              @contextmenu.prevent.stop="onEdit(prj)"
              class="grid grid-flow-col grid-cols-[repeat(6,minmax(200px,1fr))] gap-6 pt-1 my-3 mx-5 items-center hover:bg-[var(--bg-hover-context)] hover:cursor-pointer">
              <div
                class="min-w-[100px] max-w-[300px] text-center"
                @click="projectOpen(prj)"
              >
                {{prj.title}}
              </div>
              <div
                class="min-w-[50px] max-w-[300px] text-mono"
                @click="projectOpen(prj)"
              >
                {{prj.description}}
              </div>
              <div
                class="min-w-[50px] max-w-[300px] text-center"
                @click="projectOpen(prj)"
              >
                {{formatDate(prj.createdAt)}}
              </div>
              <div
                class="min-w-[50px] max-w-[300px] text-center"
                @click="projectOpen(prj)"
              >
                {{ formatDate(prj.deadline)}}
              </div>
              <div class="min-w-[50px] max-w-[300px] text-center">
                <select
                  @change="onStatusChange(prj.id, Number(($event.target as HTMLSelectElement).value))"
                  :value="prj.statusId"
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
              <div
                class="min-w-[50px] max-w-[300px] text-center"
                @click="projectOpen(prj)"
              >
                {{prj.createdBy?.name}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddOrEditProjectModalContent
        v-model="modalOpen"
        :project="selectedProject"
      />
      <InfoProjectModalContent
        v-model="projectInfo"
        :project="selectedProject"
      />
    </div>
</template>
