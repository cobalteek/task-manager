<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";
import {storeToRefs} from "pinia";
import ChangeRoleModalContent from "~/components/ChangeRoleModalContent.vue";
import type {Project} from "~~/types/project";


const auth = useAuthStore()
const {user, isLoading} = storeToRefs(auth)
const selectedProject = ref<Project>()
const chooseRole = ref(false)
const showProjects = ref(false)
const showTasks = ref(false)
const kek = '</>'

watch(showTasks, () => {
  if (showProjects.value) showProjects.value = false;
  if (!showTasks.value) showProjects.value = true;
})

function toggleTasks(project: Project) {
  if (!project) return
  selectedProject.value = project
  showTasks.value = !showTasks.value;
}

definePageMeta({
  layout: 'dashboard',
  middleware: [
    'auth',
  ],
})
</script>

<template>
  <div>
    <Loading v-if="isLoading"/>
    <div v-if="user" class="w-full h-full p-2 flex">
      <div class="w-full h-full">
        <section class="inline-flex items-center justify-end w-full gap-3">
          <button
            v-if="user.role === 'owner'"
            @click="chooseRole = !chooseRole"
            class="p-2 text-shadow btn"
          >
            {{ $t('btn.changeRole') }}
          </button>
          <button
            @click="showProjects = !showProjects"
            class="p-2 text-shadow btn"
          >
            {{ $t('btn.projects') }}
          </button>
        </section>
        <ChangeRoleModalContent
          class="w-[calc(100%-16px)] max-w-[520px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          v-model="chooseRole"
        />
        <div>
          {{ $t('user.name') }}: {{ user.name }}
        </div>
        <div>
          {{ $t('user.email') }}: {{ user.email }}
        </div>
        <div>
          {{ $t('user.gender') }}: {{ $t(`user.${user.gender}`) }}
        </div>
        <div>
          {{ $t('user.role') }}: {{ $t(`role.${user.role}`) }}
        </div>
        <ClientOnly>
          <AppTransition>
            <div v-if="showProjects" class="flex flex-col justify-center items-center">
              <ProjectsList
                class="mt-5"
                v-model="showProjects"
                @toggleTasks="toggleTasks"
              />
            </div>
            <div v-if="showTasks && selectedProject">
              <TasksList
                class="mt-5"
                :project="selectedProject"
                v-model="showTasks"
              />
            </div>
          </AppTransition>
        </ClientOnly>
      </div>
    </div>
    <AppTransition>
      <div v-if="!showProjects"
           class="my-auto w-full h-full flex justify-center items-center text-[200px] text-[var(--bg-back)]">
        <h1>{{ kek }}</h1>
      </div>
    </AppTransition>
  </div>
</template>


