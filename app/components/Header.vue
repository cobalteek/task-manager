<script setup lang="ts">
import {useAuth} from "~~/composables/useAuth";
import {navigateTo} from "nuxt/app";

const { user, logout, authReady } = useAuth()
const isLoggedIn = computed(() => !!user.value)

const logout_ = async () => {
  await logout()
  await navigateTo('/')
}

</script>

<template>
  <div class="inline-flex justify-between items-center w-full bg-[var(--bg-header)] text-white text-md">
    <NuxtLink class="" to="/">
      <img class="max-w-[100px] invert" src="../assets/logo.png" alt="logo"/>
    </NuxtLink>
    <div class="sm:inline-flex hidden gap-8">
      <NuxtLink to="/docs">
        Docs
      </NuxtLink>
      <NuxtLink to="/about">
        About
      </NuxtLink>
      <NuxtLink to="/contact">
        Contact
      </NuxtLink>
    </div>
    <div v-if="user" class="sm: mr-1">
      <button @click="logout_" class="inline-flex items-center justify-center bg- border rounded p-1 sm: mr-4">
        {{ user?.name }}
        <img src="../assets/logout.png" alt="logout" class="invert h-[30px]"/>
      </button>
    </div>
    <div v-else class="sm: mr-1">
      <NuxtLink class="sm: mr-1" to= "/sign-in">
        Sign In
      </NuxtLink>
      <NuxtLink to="/sign-up" class="bg- border-2 rounded p-0.5 sm: mr-1">Sign Up</NuxtLink>
    </div>
  </div>
</template>
