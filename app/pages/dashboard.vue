<script setup lang="ts">
import {useAuth} from "~~/composables/useAuth";
const { user, authReady }  = useAuth()

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
    <div v-else-if="!authReady" class="text-xl text-orange-600">
      Loading...
    </div>
  </div>
</template>
