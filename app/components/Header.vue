<script setup lang="ts">

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
    <div class="sm: mr-1">
      <NuxtLink class="sm: mr-1" to= "/sign-in">
        Sign In
      </NuxtLink>
      <NuxtLink to="/sign-up" class="bg- border-2 rounded p-0.5 sm: mr-1">Sign Up</NuxtLink>
    </div>
  </div>
</template>
