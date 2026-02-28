<script setup lang="ts">
import {useAuthStore} from "~~/stores/auth";

const auth = useAuthStore()
const { user, isLoading } = storeToRefs(auth)

definePageMeta({
  middleware: [
    'auth',
  ],
})
</script>

<template>
  <div>
    <div v-if="user" class="text-xl text-orange-600">

      <h1> Salam {{ user?.name }} </h1>
      <p> Your email: {{ user?.email }}</p>

    </div>
    <div v-else-if="isLoading" class="text-xl text-orange-600">
      Loading...
    </div>
  </div>
</template>
