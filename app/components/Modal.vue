<script setup lang="ts">
const props = defineProps<{
  type: string,
  head: string,
  text: string,
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
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-90 translate-y-4"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
  <div v-if="modelValue" class="flex flex-grid grid-col-2 grid-row-2 gap-2 fixed w-[300px] h-[200px] border border-gray-200 border-solid rounded-xl bg-[var(--bg-modal)] top-[18%]">
    <div class="row-span-2 mr-1 my-auto ml-5">
      <div v-if="type == 'error'" class="w-[30px] h-[30px] bg-[var(--bg-error)] rounded-full border border-gray-200 rounded-md text-sm leading-tight text-center text-xl">
        !
      </div>
      <div v-if="type == 'info'" class="w-[30px] h-[30px] bg-[var(--bg-info)] text-semibold text-black rounded-full border border-gray-200 text-sm leading-tight text-center text-xl">
        i
      </div>
    </div>
    <div class="w-[199px] text-center gap-2 mt-12">
      <div class="text-xl mx-auto font-semibold leading-tight pt-2 block">
        {{head}}
      </div>
      <div class="mx-auto text-center h-[50px] mt-3">
        {{text}}
      </div>
      <button @click="close" class="border border-solid border-gray-200 rounded-md p-1 mt-1">
        Close
      </button>
    </div>
  </div>
  </Transition>
</template>

<style scoped>

</style>
