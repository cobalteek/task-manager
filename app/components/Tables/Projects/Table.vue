<script setup lang="ts">
import type { Project } from "~~/types/project"
import { formatDate } from "~~/utils/formatDate"
import { hasAccess } from "~~/utils/hasAccess"

const props = defineProps<{
  projects: Project[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'open', project: Project): void
  (e: 'edit', project: Project): void
}>()

const headers = computed(() => [
  $t('project.title'),
  $t('project.description'),
  $t('project.status'),
  $t('project.deadline'),
  $t('project.createdAt'),
  $t('project.createdBy'),
])

const projectColumns = 'minmax(180px, 1.4fr) minmax(220px, 1.8fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(140px, 0.9fr) minmax(150px, 1fr)'

function onOpen(project: Project) {
  emit('open', project)
}

function onEdit(project: Project) {
  emit('edit', project)
}
</script>

<template>
  <TablesBase :headers="headers" :grid-template-columns="projectColumns">
    <template #default="{ gridTemplateColumns }">
      <div
        v-for="prj in projects"
        :key="prj.id"
        class="grid gap-1 pt-1 my-3 items-center hover:bg-[var(--bg-hover-context)] hover:cursor-pointer"
        :style="{ gridTemplateColumns }"
        @contextmenu.prevent.stop="onEdit(prj)"
      >
        <div
          class="min-w-[100px] max-w-[300px] text-center overflow-hidden line-clamp-3 break-words"
          @click="onOpen(prj)"
        >
          {{ prj.title }}
        </div>

        <div
          class="min-w-[50px] max-w-[300px] overflow-hidden line-clamp-3 break-words"
          @click="onOpen(prj)"
        >
          {{ prj.description }}
        </div>

        <StatusesList
          :disabled="!hasAccess({ project: prj, roles: ['owner'] })"
          :project="prj"
        />

        <div
          class="min-w-[50px] max-w-[300px] text-center"
          @click="onOpen(prj)"
        >
          {{ formatDate(prj.deadline) }}
        </div>

        <div
          class="min-w-[50px] max-w-[300px] text-center"
          @click="onOpen(prj)"
        >
          {{ formatDate(prj.createdAt) }}
        </div>

        <div
          class="min-w-[50px] max-w-[300px] text-center"
          @click="onOpen(prj)"
        >
          {{ prj.createdBy.name }}
        </div>
      </div>

      <Loading v-if="isLoading" />
    </template>
  </TablesBase>
</template>
