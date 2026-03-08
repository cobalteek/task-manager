<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  type: string
  head: string
  text: string
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

function close() {
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (v) => {
  console.log('child modelValue:', v)
})

</script>

<template>
  <Modal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    class="w-[320px] h-[180px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <div
      class="inline-flex justify-start gap-5 w-full h-full ml-3 mt-4">
      <div class="row-start-1 flex justify-center items-center mt-9">
        <div
          v-if="type == 'error'"
          class="w-[30px] h-[30px] bg-[var(--bg-error)] rounded-full border border-gray-200 leading-tight text-center text-xl"
        >
          !
        </div>
        <div
          v-if="type == 'info'"
          class="w-[30px] h-[30px] bg-[var(--bg-info)] text-semibold text-black rounded-full border border-gray-200 leading-tight text-center text-xl"
        >
          i
        </div>
      </div>
      <div class="w-[199px] text-center my-auto">
        <div class="text-xl font-semibold leading-tight mr-4">
          {{head}}
        </div>
        <div class="mx-auto font-mono mt-3">
          {{text}}
        </div>
      </div>
    </div>
  </Modal>
</template>
