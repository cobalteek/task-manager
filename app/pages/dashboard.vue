<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";
import ProjectsList from "~/components/ProjectsList.vue";
import { storeToRefs } from "pinia";
import {useBreakpoint} from "~~/composables/useBreakpoint";


const auth = useAuthStore()
const { user, isLoading } = storeToRefs(auth)
const { isMobile, isDesktop, isTablet } = useBreakpoint()
const showAddAdmin = ref(false)
const showProjects = ref(false)
const kek = '</>'

definePageMeta({
  layout: 'dashboard',
  middleware: [
    'auth',
  ],
})
</script>

<template>
  <div>
    <div v-if="isLoading" class="text-xl text-orange-600">
      Loading...
    </div>
    <div v-else-if="user" class="w-full h-full p-2 flex">
      <div class="w-full h-full">
        <section class="inline-flex items-center justify-end w-full gap-3">
          <button @click="showAddAdmin = !showAddAdmin" class="p-2 text-shadow border border-solid border-gray-100 rounded-md flex justify-center items-center gap-1">
            <span class="text-xl mb-1">+</span> New Admin
          </button>
          <button @click="showProjects = !showProjects" class="p-3 text-shadow border border-solid border-gray-100 rounded-md">
            Projects
          </button>
        </section>
        <AddAdminModalContent
          class="w-[320px] h-[180px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          v-model="showAddAdmin"
        />
        <div>
          Name: {{user.name}}
        </div>
        <div>
          Email: {{user.email}}
        </div>
        <div>
          Gender: {{user.gender}}
        </div>
        <div>
          Role: {{user.role}}
        </div>
        <AppTransition>
          <div v-if="showProjects" class="flex flex-col justify-center items-center">
            <ProjectsList
              v-if="(isDesktop || isTablet)"
              class="mt-5"
              v-model="showProjects"/>
            <SMProjectList
              v-if="isMobile"
            />
          </div>
        </AppTransition>
      </div>
    </div>
    <AppTransition>
      <div v-if="!showProjects" class="my-auto w-full h-full flex justify-center items-center text-[200px] text-[var(--bg-back)]">
        <h1>{{kek}}</h1>
      </div>
    </AppTransition>
  </div>
</template>


