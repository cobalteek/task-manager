<script setup lang="ts">
import AppTransition from "~/components/AppTransition.vue";

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <AppTransition>
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
    >
      <div
        v-bind="$attrs"
        class="relative flex flex-col border border-solid border-[var(--bg-main)] rounded-2xl bg-[var(--bg-modal)] min-w-[280px] min-h-[160px] shadow-xl"
      >
        <button
          type="button"
          @click="close"
          class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-main)] bg-[var(--btn-bg)]text-lg leading-none transition hover:scale-95"
        >
          ×
        </button>

        <div class="flex-1">
          <slot />
        </div>
      </div>
    </div>
  </AppTransition>
</template>
