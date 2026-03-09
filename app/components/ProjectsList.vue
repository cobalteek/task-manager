<script setup lang="ts">
import {useProjectsStore} from "~/stores/projects";
import {formatDate} from "~~/utils/formatDate";
import {storeToRefs} from "pinia";
import type {Project} from "~~/types/project";
import AddOrEditProjectModalContent from "~/components/AddOrEditProjectModalContent.vue";
import {creatorOnly} from "~~/utils/creatorOnly";

defineProps<{ modelValue: boolean }>()

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const selectedProject = ref<Project | undefined>(undefined)

const modalOpen = ref(false)
const projectInfo = ref(false)
const modalError = ref(false)
const allProjects = ref(true)

const textError = ref('')
const query = ref('')
const type_ = ref('')

const projectsStore = useProjectsStore()

const {projects} = storeToRefs(projectsStore)

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
      'Failed to search projects'
    modalError.value = true
    return
  }
})

function close() {
  emit('update:modelValue', false)
}

function onAdd() {
  selectedProject.value = undefined
  modalOpen.value = true
}

function onEdit(project: Project) {
  if (creatorOnly(project)) {
    selectedProject.value = project
    modalOpen.value = true
    return
  }
  textError.value = '"Only the creator of the project can do it."'
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
      'Failed to fetch all projects'
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
      'Failed to fetch all projects'
  }
}

</script>

<template>
  <div
    class="w-full border border-solid border-gray-100 rounded-md h-[50vh] overflow-x-hidden hide-scrollbar max-w-[1500px]"
    v-if="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <div class="relative">
      <div class="w-full inline-flex justify-center pt-1 lg:justify-end">
        <div class="flex items-center gap-3">
          <button
            :disabled = allProjects
            @click="allFetch"
            class="p-3 text-shadow btn"
          >
            All Projects
          </button>
          <button
            :disabled = !allProjects
            @click="myFetch"
            class="p-3 text-shadow btn"
          >
            My Projects
          </button>
          <button
            @click="onAdd"
            class="p-3 text-shadow btn"
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
    <div class="overflow-x-auto hide-scrollbar h-full">
      <div class=" max-w-[1500px]">
        <div class="grid grid-flow-col grid-cols-[repeat(6,minmax(200px,1fr))] gap-6 mx-5 pt-1 my-3 text-center w-full">
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
        <div class="h-full">
          <div
            v-for="prj in projects"
            :key="prj?.id"
            @contextmenu.prevent.stop="onEdit(prj)"
            class="grid grid-flow-col grid-cols-[repeat(6,minmax(200px,1fr))] gap-6 pt-1 my-3 mx-5 items-center hover:bg-[var(--bg-hover-context)] hover:cursor-pointer">
            <div
              class="min-w-[100px] max-w-[300px] text-center overflow-hidden line-clamp-3 break-words"
              @click="projectOpen(prj)"
            >
              {{ prj?.title }}
            </div>
            <div>
              <div
                class="min-w-[50px] max-w-[300px] overflow-hidden line-clamp-3 break-words"
                @click="projectOpen(prj)"
              >
                {{ prj?.description }}
              </div>
            </div>
            <div
              class="min-w-[50px] max-w-[300px] text-center"
              @click="projectOpen(prj)"
            >
              {{ formatDate(prj?.createdAt) }}
            </div>
            <div
              class="min-w-[50px] max-w-[300px] text-center"
              @click="projectOpen(prj)"
            >
              {{ formatDate(prj?.deadline) }}
            </div>
            <StatusesList
              :disabled=!creatorOnly(prj)
              :project="prj"
            />
            <div
              class="min-w-[50px] max-w-[300px] text-center"
              @click="projectOpen(prj)"
            >
              {{ prj.createdBy?.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddOrEditProjectModalContent
      :sort="allProjects"
      v-model="modalOpen"
      :project="selectedProject"
    />
    <InfoProjectModalContent
      v-if="selectedProject"
      v-model="projectInfo"
      :project="selectedProject"
    />
    <ErrorModalContent
      v-model="modalError"
      type="error"
      :text="textError"/>
  </div>
</template>
