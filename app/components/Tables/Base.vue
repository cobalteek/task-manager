<script setup lang="ts">
const props = defineProps<{
  headers: string[]
  columns?: number
  minColWidth?: string
  gridTemplateColumns?: string
}>()

const resolvedGridTemplateColumns = computed(() => {
  if (props.gridTemplateColumns) return props.gridTemplateColumns

  return `repeat(${props.columns ?? props.headers.length}, minmax(${props.minColWidth ?? '200px'}, 1fr))`
})

const minWidth = computed(() => {
  if (props.gridTemplateColumns) return '1000px'
  return `${(props.columns ?? props.headers.length) * Number.parseInt(props.minColWidth ?? '200')}px`
})
</script>

<template>
  <div class="overflow-x-auto hide-scrollbar h-full">
    <div
      class="w-full"
      :style="{ minWidth }"
    >
      <div
        class="grid my-3 text-center"
        :style="{ gridTemplateColumns: resolvedGridTemplateColumns }"
      >
        <div
          v-for="header in headers"
          :key="header"
        >
          {{ header }}
        </div>
      </div>

      <hr class="my-1 w-full">

      <div class="h-full">
        <slot :grid-template-columns="resolvedGridTemplateColumns" />
      </div>
    </div>
  </div>
</template>
