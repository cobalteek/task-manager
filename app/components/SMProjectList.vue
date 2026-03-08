<script setup="setup" lang="ts">
import { formatDate } from "~~/utils/formatDate";
import AutoTextArea from "~/components/AutoTextArea.vue";
import { useProjectsStore } from "~/stores/projects";
import type { Project } from "~~/types/project";
import {storeToRefs} from "pinia";
import AddOrEditProjectModalContent from "~/components/AddOrEditProjectModalContent.vue";
import {creatorOnly} from "~~/utils/creatorOnly";

const selectedProject = ref<Project>();
const modalOpen = ref(false)
const modalError = ref(false)
const query = ref('')
const textError = ref('')

const projectsStore = useProjectsStore()

const { projects } = storeToRefs(projectsStore)

onMounted(async () => {
  await projectsStore.fetchAll()
})

watch(query, async (v) => {
  await projectsStore.searchProjects(v)
})

function onAdd() {
  selectedProject.value = undefined
  modalOpen.value = true
}

function onEdit(project: Project)  {
  if(creatorOnly(project)) {
    selectedProject.value = project
    modalOpen.value = true
    return
  }
  textError.value = 'Only the creator of the project can do it.'
  modalError.value = true
}
</script>

<template>
    <div>
      <div class="inline-flex justify-end w-full">
        <div class="flex items-center gap-3">
          <div class="ml-1 relative inline-block mr-1">
            <input
              v-model="query"
              class="focus:outline-none text-black rounded-xl p-1"
              placeholder="Search"
            >
            <img alt="search logo" src="../assets/search16.svg" class="absolute right-2 top-1/2 -translate-y-1/2">
          </div>
          <button
            @click="onAdd"
            class="p-3 text-shadow border border-solid border-gray-100 rounded-md"
          >
            Add
          </button>
        </div>
      </div>
      <div v-for="prj in projects"
           :key="prj?.id"
           @click="onEdit(prj)"
           class="mt-5 w-full">
        <div class="flex flex-col border border-gray-200 border-solid rounded-xl h-[600px]">
            <div class="flex flex-col justify-center items-center w-full my-auto">
              <div>
                Title
              </div>
              <AutoTextArea
                :text="prj.title"
                class="w-1/2 text-black text-center rounded-md max-h-[50px] border overflow-y-auto bg-[var(--bg-context)] text-gray-100"
              />
            </div>
            <div class="my-auto flex flex-col justify-center items-center w-full">
              <div>
                Description
              </div>
              <AutoTextArea
                :text="prj.description"
                class="w-[95%] max-h-[300px] max-w-[550px] resize-none overflow-y-auto rounded-md border p-2 text-black active:border-0 m-1 bg-[var(--bg-context)] text-gray-100"
              />
            </div>
            <section class="inline-flex justify-between items-center w-full px-3 my-auto gap-4">
              <div>
                Created At: {{ formatDate(prj.createdAt) }}
              </div>
              <div>
                Deadline: {{ formatDate(prj.deadline) }}
              </div>
            </section>
            <section class="inline-flex justify-between items-center w-full px-3 my-auto">
              <div class="'flex flex-col gap-2 justify-center items-center' gap-2 items-center">
                <div class="text-[18px] text-center">
                  Status:
                </div>
                <StatusesList :project="prj" />
              </div>
              <div class='flex flex-col gap-2 justify-center items-center'>
                <div>
                  Created by:
                </div>
                <div>
                  {{ prj.createdBy.name }}
                </div>
              </div>
            </section>
          </div>
      </div>
      <AddOrEditProjectModalContent
        v-model="modalOpen"
        :project="selectedProject"
      />
      <ErrorModalContent
        v-model="modalError"
        head="Error"
        type="error"
        :text="textError"/>
    </div>
</template>
