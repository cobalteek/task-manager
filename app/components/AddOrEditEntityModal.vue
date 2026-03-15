<script setup lang="ts">

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()


</script>

<template>
  <Modal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    class="w-full h-[600px] max-w-[600px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <slot/>
  </Modal>
</template>
