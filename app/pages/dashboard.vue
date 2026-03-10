<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";
import {storeToRefs} from "pinia";
import {useBreakpoint} from "~~/composables/useBreakpoint";
import ChangeRoleModalContent from "~/components/ChangeRoleModalContent.vue";


const auth = useAuthStore()
const {user, isLoading} = storeToRefs(auth)
const {isMobile, isDesktop, isTablet} = useBreakpoint()
const chooseRole = ref(false)
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
    <Loading v-if="isLoading"/>
    <div v-if="user" class="w-full h-full p-2 flex">
      <div class="w-full h-full">
        <section class="inline-flex items-center justify-end w-full gap-3">
          <button v-if="user.role === 'OWNER'" @click="chooseRole = !chooseRole"
                  class="p-2 text-shadow btn">
            Change Role
          </button>
          <button @click="showProjects = !showProjects"
                  class="p-2 text-shadow btn">
            Projects
          </button>
        </section>
        <ChangeRoleModalContent
          class="w-[320px] h-[180px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          v-model="chooseRole"
        />
        <div>
          Name: {{ user.name }}
        </div>
        <div>
          Email: {{ user.email }}
        </div>
        <div>
          Gender: {{ user.gender }}
        </div>
        <div>
          Role: {{ user.role }}
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
      <div v-if="!showProjects"
           class="my-auto w-full h-full flex justify-center items-center text-[200px] text-[var(--bg-back)]">
        <h1>{{ kek }}</h1>
      </div>
    </AppTransition>
  </div>
</template>


