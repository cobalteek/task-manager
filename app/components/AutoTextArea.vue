<script setup lang="ts">
import {nextTick, ref, watch} from 'vue'

const props = defineProps<{
  text?: string
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

async function setHeight() {
  await nextTick()

  const el = textareaRef.value
  if (!el) return

  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

watch(
  () => props.text,
  () => {
    setHeight()
  },
  {immediate: true}
)
</script>

<template>
  <textarea
    ref="textareaRef"
    :value="props.text"
    readonly
    rows="1"
    class="resize-none overflow-hidden"
  />
</template>
