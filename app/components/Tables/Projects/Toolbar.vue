<script setup lang="ts">
import { hasAccess } from "~~/utils/hasAccess"
import {useBreakpoint} from "~~/composables/useBreakpoint";

const {isMobile, isDesktop, isTablet} = useBreakpoint()

defineProps<{
  query: string
  allProjects: boolean
}>()

const emit = defineEmits<{
  (e: "update:query", value: string): void
  (e: "all"): void
  (e: "my"): void
  (e: "add"): void
  (e: "close"): void
}>()
</script>

<template>
  <div class="w-full">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <div class="inline-flex justify-between">
          <div class="relative md:w-full sm:w-[90%] sm:max-w-[320px]">
            <input
              :value="query"
              class="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] py-2 pl-3 pr-9 text-[var(--input-text)] focus:outline-none"
              :placeholder="$t('form.placeholder.search')"
              @input="emit('update:query', ($event.target as HTMLInputElement).value)"
            >
            <img
              alt="search logo"
              src="../../../assets/search16.svg"
              class="absolute right-3 top-1/2 -translate-y-1/2"
            >
          </div>
          <div v-if="isMobile" class="flex justify-end">
            <button
              @click="emit('close')"
              class="px-2 py-1 text-2xl leading-none"
            >
              {{ $t('btn.cross') }}
            </button>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            :disabled="allProjects"
            @click="emit('all')"
            class="px-3 py-2 text-shadow btn"
          >
            {{ $t('btn.allProjects') }}
          </button>

          <button
            :disabled="!allProjects"
            @click="emit('my')"
            class="px-3 py-2 text-shadow btn"
          >
            {{ $t('btn.myProjects') }}
          </button>

          <button
            v-if="hasAccess({ roles: ['owner'] })"
            @click="emit('add')"
            class="px-3 py-2 text-shadow btn"
          >
            {{ $t('btn.add') }}
          </button>
        </div>
      </div>

      <div
        v-if="!isMobile"
        class="flex justify-end">
        <button
          @click="emit('close')"
          class="px-2 py-1 text-2xl leading-none"
        >
          {{ $t('btn.cross') }}
        </button>
      </div>
    </div>
  </div>
</template>
