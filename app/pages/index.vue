<script setup lang="ts">
import {useAuthStore} from "~~/stores/auth";

const auth = useAuthStore()
const { user } = storeToRefs(auth)

function sosiska() {
  console.log('sosiska')
}
const sosiska_ = 'sosiska'
</script>
<template>
  <div>
    <h1 class="text-xl text-gray-100 text-shadow">
      Home
    </h1>
    <h3 v-if="user" class="text-xl text-gray-100 text-center">
      Hello, {{user?.name}}! {{sosiska_}}
    </h3>
    <code>
      private const string API = "api";
      private const string AUTH = "auth";
      public const string REGISTER = $"{API}/{AUTH}/register";
      public const string LOGIN = $"{API}/{auth}/login";
    </code>
    <button @click="sosiska">
      Meow
    </button>
  </div>
</template>
