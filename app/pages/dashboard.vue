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
const showTasks = ref(false)
const kek = '</>'

watch(showTasks, () => {
  if(showProjects.value) showProjects.value = false;
})

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
            {{$t('btn.changeRole')}}
          </button>
          <button
            @click="showProjects = !showProjects"
            class="p-2 text-shadow btn"
          >
            {{$t('btn.projects')}}
          </button>
          <button
            @click="showTasks = !showTasks"
            class="p-2 text-shadow btn"
          >
            {{$t('btn.tasks')}}
          </button>
        </section>
        <ChangeRoleModalContent
          class="w-[320px] h-[180px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          v-model="chooseRole"
        />
        <div>
          {{$t('user.name')}}: {{ user.name }}
        </div>
        <div>
          {{$t('user.email')}}: {{ user.email }}
        </div>
        <div>
          {{$t('user.gender')}}: {{ $t(`user.${user.gender}`) }}
        </div>
        <div>
          {{$t('user.role')}}: {{ $t(`role.${user.role}`) }}
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


