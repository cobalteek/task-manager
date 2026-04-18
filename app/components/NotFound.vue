<script setup lang="ts">
const targetText = `<${$t('error.notFound')}/>`
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <div class="font-mono text-2xl text-[var(--text-main)]">
      {{targetText}}
    </div>
  </div>
</template>
