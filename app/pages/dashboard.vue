<script setup lang="ts">
import {useAuth} from "~~/composables/useAuth";
const { user, authReady }  = useAuth()

const isLoggedIn = computed(() => !!user.value)

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
    <div v-else class="text-xl text-orange-600">
      Loading...
    </div>
  </div>
</template>
