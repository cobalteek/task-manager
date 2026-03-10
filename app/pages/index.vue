<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";

const auth = useAuthStore()
const {user} = storeToRefs(auth)
</script>
<template>
  <div>
    <h1 class="text-xl text-gray-100 text-shadow">
      {{$t('pages.home')}}
    </h1>
    <h3 v-if="user" class="text-xl text-gray-100 text-center">
      {{$t('message.hello')}}, {{ user?.name }}!
    </h3>
  </div>
</template>
