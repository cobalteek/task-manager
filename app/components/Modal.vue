<script setup lang="ts">
defineProps<{
  modelValue: boolean,
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

function close() {
  emit('update:modelValue',  false);
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
    <div v-if="modelValue" class="$attrs flex grid grid-rows-[2fr,auto] gap-2 fixed border border-gray-200 border-solid rounded-xl bg-[var(--bg-modal)]">
      <div class="row-start-1">
        <slot />
      </div>
      <div class="row-start-2 flex justify-center h-[50px] items-center">
        <button @click="close" class="border border-solid border-gray-200 rounded-md p-1 ">
          Close
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>

</style>
