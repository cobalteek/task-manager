<script setup lang="ts">

</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <div class="flex flex-1 bg-[var(--bg-back)]">
      <main class="flex-1">
        <div class="container mx-auto w-full h-full text-gray-100 bg-[var(--bg-context)] rounded-sm">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
