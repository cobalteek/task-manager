<script setup lang="ts">
 defineProps<{
  modelValue: boolean
  type: string,
  head: string,
  text: string,
}>();

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

</script>

<template>
  <Modal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)">
    <div class="inline-flex justify-start gap-5 w-full h-full ml-3 mt-4">
      <div class="row-start-1 flex justify-center items-center mt-9">
        <div
          v-if="type == 'error'"
          class="w-[30px] h-[30px] bg-[var(--bg-error)] rounded-full border border-gray-200 rounded-md text-sm leading-tight text-center text-xl"
        >
          !
        </div>
        <div
          v-if="type == 'info'"
          class="w-[30px] h-[30px] bg-[var(--bg-info)] text-semibold text-black rounded-full border border-gray-200 text-sm leading-tight text-center text-xl"
        >
          i
        </div>
      </div>
      <div class="w-[199px] text-center my-auto">
        <div class="text-xl font-semibold leading-tight mr-4">
          {{head}}
        </div>
        <div class="mx-auto py-auto font-mono  mt-3">
          {{text}}
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>

</style>
