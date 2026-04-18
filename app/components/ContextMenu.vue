<script setup lang="ts">
type MenuItem = {
  label: string
  key: string
  disabled?: boolean
  danger?: boolean
}

const props = defineProps<{
  modelValue: boolean
  x: number
  y: number
  items: MenuItem[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'select', key: string): void
}>()

function closeMenu() {
  emit('update:modelValue', false)
}

function onSelect(item: MenuItem) {
  if (item.disabled) return
  emit('select', item.key)
  closeMenu()
}

function handleOutsideClick() {
  closeMenu()
}

onMounted(() => {
  window.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleOutsideClick)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed z-50 min-w-[200px] overflow-hidden rounded-md border border-[var(--bg-main)] bg-[var(--bg-context)] shadow-lg"
      :style="{
        left: `${x}px`,
        top: `${y}px`
      }"
      @click.stop
      @contextmenu.prevent
    >
      <button
        v-for="item in items"
        :key="item.key"
        class="block w-full px-4 py-2 text-[var(--text-main)] bg-[var(--bg-context)] text-left hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="item.disabled"
        @click="onSelect(item)"
      >
        {{ item.label }}
      </button>
    </div>
  </Teleport>
</template>
