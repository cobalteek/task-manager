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
      class="fixed inset-0 flex items-center justify-center"
    >
      <div
        v-bind="$attrs"
        class="flex flex-col gap-2 border border-solid border-gray-200 rounded-xl bg-[var(--bg-modal)] min-w-[280px] min-h-[160px]"
      >
        <div class="flex-1">
          <slot/>
        </div>

        <div class="flex justify-center items-center h-[50px]">
          <button
            type="button"
            @click="close"
            class="border border-solid border-gray-200 rounded-md p-1"
          >
            {{ $t('btn.close') }}
          </button>
        </div>
      </div>
    </div>
  </AppTransition>
</template>
