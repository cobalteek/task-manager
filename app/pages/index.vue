<script setup lang="ts">
import {useAuthStore} from "~~/stores/auth";

const auth = useAuthStore()
const { user, isLoading } = storeToRefs(auth)
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
