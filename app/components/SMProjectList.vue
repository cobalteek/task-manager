<script setup lang="ts">
import {useProjectsStore} from "~/stores/projects";
import {formatDate} from "~~/utils/formatDate";
import {storeToRefs} from "pinia";
import type {Project} from "~~/types/project";
import AddOrEditProjectModalContent from "~/components/AddOrEditProjectModalContent.vue";
import {creatorOnly} from "~~/utils/creatorOnly";

const selectedProject = ref<Project | undefined>(undefined)
const modalOpen = ref(false)
const modalError = ref(false)
const allProjects = ref(true)

const textError = ref('')
const query = ref('')
const type_ = ref('')

const projectsStore = useProjectsStore()

const {projects, isLoading} = storeToRefs(projectsStore)

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
    return
  }
})

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
  textError.value = $t('error.user.creatorOnly')
  modalError.value = true
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

</script>

<template>
  <div>
    <div class="inline-flex justify-center w-full mt-1">
      <div class="flex items-center gap-3">
        <div class="flex flex-col items-center gap-2">
          <button
            :disabled = allProjects
            @click="allFetch"
            class="p-1 text-shadow btn"
          >
            {{ $t('btn.allProjects') }}
          </button>
          <button
            :disabled = !allProjects
            @click="myFetch"
            class="p-1 text-shadow btn"
          >
            {{ $t('btn.myProjects') }}
          </button>
        </div>
        <button
          @click="onAdd"
          class="p-3 text-shadow btn"
        >
          {{ $t('btn.add') }}
        </button>
        <div class="relative inline-block">
          <input
            v-model="query"
            class="focus:outline-none text-black rounded-xl p-1 bg-white "
            placeholder="$t('form.placeholder.search')"
          >
          <img alt="search logo" src="../assets/search16.svg" class="absolute right-0 top-1/2 -translate-y-1/2">
        </div>
      </div>
    </div>
    <div
      v-if="projects"
      v-for="prj in projects"
      :key="prj?.id"
      @click="onEdit(prj)"
      class="mt-5 w-full">
      <div class="flex flex-col border border-gray-200 border-solid rounded-xl h-[600px]">
        <div class="flex flex-col justify-center items-center w-full my-auto">
          <div>
            {{ $t('project.title') }}
          </div>
          <AutoTextArea
            :text="prj.title"
            class="w-1/2 text-black text-center rounded-md max-h-[50px] border overflow-y-auto bg-[var(--bg-context)] text-gray-100"
          />
        </div>
        <div class="my-auto flex flex-col justify-center items-center w-full">
          <div>
            {{ $t('project.description') }}
          </div>
          <AutoTextArea
            :text="prj.description"
            class="w-[95%] max-h-[300px] max-w-[550px] resize-none overflow-y-auto rounded-md border p-2 text-black active:border-0 m-1 bg-[var(--bg-context)] text-gray-100"
          />
        </div>
        <section class="inline-flex justify-between items-center w-full px-3 my-auto gap-4">
          <div>
            {{ $t('project.createdAt') }}: {{ formatDate(prj.createdAt) }}
          </div>
          <div>
            {{ $t('project.deadline') }}: {{ formatDate(prj.deadline) }}
          </div>
        </section>
        <section class="inline-flex justify-between items-center w-full px-3 my-auto">
          <div class="'flex flex-col gap-2 justify-center items-center' gap-2 items-center">
            <div class="text-[18px] text-center">
              {{ $t('project.status') }}:
            </div>
            <StatusesList
              :disabled=!creatorOnly(prj)
              :project="prj"
            />
          </div>
          <div class='flex flex-col gap-2 justify-center items-center'>
            <div>
              {{ $t('project.createdBy') }}:
            </div>
            <div>
              {{ prj.createdBy.name }}
            </div>
          </div>
        </section>
      </div>
    </div>
    <Loading v-if="isLoading" />
    <AddOrEditProjectModalContent
      :sort="allProjects"
      v-model="modalOpen"
      :project="selectedProject"
    />
    <ErrorModalContent
      v-model="modalError"
      :type="type_"
      :text="textError"/>
  </div>
</template>
