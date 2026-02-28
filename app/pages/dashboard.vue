<script setup lang="ts">
import {useAuthStore} from "~~/stores/auth";

const auth = useAuthStore()
const { user, isLoading } = storeToRefs(auth)

definePageMeta({
  layout: 'dashboard',
  middleware: [
    'auth',
  ],
})
</script>

<template>
  <div>
    <div v-if="user" class="w-full h-full pl-3 pt-2 flex text-xl text-orange-600">
      <div>
        <div>
          Name: {{user.name}}
        </div>
        <div>
          Email: {{user.email}}
        </div>
        <div>
          Gender: {{user.gender}}
        </div>

      </div>


    </div>
    <div v-else-if="isLoading" class="text-xl text-orange-600">
      Loading...
    </div>
  </div>
</template>
