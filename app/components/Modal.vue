<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

function close() {
  console.log('modal close click')
  emit('update:modelValue', false)
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-90"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 flex items-center justify-center"
    >
      <div
        v-bind="$attrs"
        class="flex flex-col gap-2 border border-solid border-gray-200 rounded-xl bg-[var(--bg-modal)] min-w-[280px] min-h-[160px]"
      >
        <div class="flex-1">
          <slot />
        </div>

        <div class="flex justify-center items-center h-[50px]">
          <button
            @click="close"
            class="border border-solid border-gray-200 rounded-md p-1"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
