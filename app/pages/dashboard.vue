<script setup lang="ts">
import {useAuthStore} from "~~/stores/auth";
import ProjectsList from "~/components/ProjectsList.vue";

const auth = useAuthStore()
const { user, isLoading } = storeToRefs(auth)

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
    <div v-if="user" class="w-full h-full p-2 flex">
      <div class="w-full h-full">
        <section v-if="user.role == 'OWNER'" class="inline-flex items-center justify-end w-full gap-3">
          <button @click="showAddAdmin = true" class="p-2 text-shadow border border-solid border-gray-100 rounded-md flex justify-center items-center gap-1">
            <span class="text-xl mb-1">+</span> New Admin
          </button>
          <button @click="showProjects = true" class="p-3 text-shadow border border-solid border-gray-100 rounded-md">
            Projects
          </button>
        </section>
        <AddAdminModalContent v-model="showAddAdmin"/>
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
        <div v-if="showProjects" class="flex justify-center">
          <ProjectsList class="mt-5" v-model="showProjects"/>
        </div>
      </div>
    </div>
      <div v-if="!showProjects" class="my-auto w-full h-full flex justify-center items-center text-[200px] text-[var(--bg-back)]">
        <h1>{{kek}}</h1>
      </div>
    <div v-else-if="isLoading" class="text-xl text-orange-600">
      Loading...
    </div>
  </div>
</template>


