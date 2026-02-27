<script setup lang="ts">
import { useAuth } from '~~/composables/useAuth'
const { user } = useAuth()
</script>
<template>
  <div>
    <h1 class="text-xl text-gray-100 text-shadow">
      Home
    </h1>
    <h3 v-if="user" class="text-xl text-gray-100 text-center">
      Hello, {{user?.name}}!
    </h3>
  </div>
</template>
