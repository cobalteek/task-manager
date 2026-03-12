<script setup lang="ts">
import {hasAccess} from "~~/utils/hasAccess";

const props = defineProps<{
  query: string
  allProjects: boolean
}>()

const emit = defineEmits<{
  (e: 'update:query', value: string): void
  (e: 'all'): void
  (e: 'my'): void
  (e: 'add'): void
  (e: 'close'): void
}>()
</script>

<template>
  <div class="relative">
    <div class="w-full inline-flex justify-center pt-1 lg:justify-end">
      <div class="flex items-center gap-3">
        <button
          :disabled="allProjects"
          @click="emit('all')"
          class="p-3 text-shadow btn"
        >
          {{ $t('btn.allProjects') }}
        </button>

        <button
          :disabled="!allProjects"
          @click="emit('my')"
          class="p-3 text-shadow btn"
        >
          {{ $t('btn.myProjects') }}
        </button>

        <button
          v-if="!hasAccess( { roles: ['owner'] })"
          @click="emit('add')"
          class="p-3 text-shadow btn"
        >
          {{ $t('btn.add') }}
        </button>

        <div class="relative inline-block">
          <input
            :value="query"
            class="focus:outline-none rounded-xl p-1 bg-white text-black"
            :placeholder="$t('form.placeholder.search')"
            @input="emit('update:query', ($event.target as HTMLInputElement).value)"
          >
          <img
            alt="search logo"
            src="../../../assets/search16.svg"
            class="absolute right-2 top-1/2 -translate-y-1/2"
          >
        </div>
      </div>

      <button
        @click="emit('close')"
        class="p-3 text-shadow text-2xl"
      >
        {{ $t('btn.cross') }}
      </button>
    </div>
  </div>
</template>
