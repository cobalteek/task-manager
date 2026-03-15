<script setup lang="ts">
import type {Task} from "~~/types/task"
import {formatDate} from "~~/utils/formatDate"
import {hasAccess} from "~~/utils/hasAccess"
import type {Project} from "~~/types/project";
import NotFound from "~/components/NotFound.vue";

 defineProps<{
  project: Project
  tasks: Task[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'open', task: Task): void
  (e: 'edit', task: Task): void
}>()

const headers = computed(() => [
  $t('table.title'),
  $t('table.description'),
  $t('table.status'),
  $t('table.deadline'),
  $t('table.createdAt'),
  $t('table.handler'),
])

const taskColumns = 'minmax(180px, 1.8fr) minmax(220px, 1.8fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(140px, 0.9fr) minmax(150px, 1fr)'

function onOpen(task: Task) {
  emit('open', task)
}

function onEdit(task: Task) {
  emit('edit', task)
}
</script>

<template>
  <TablesBase :headers="headers" :grid-template-columns="taskColumns">
    <template #default="{ gridTemplateColumns }">
      <div
        v-for="tsk in tasks"
        :key="tsk.id"
        @contextmenu.prevent.stop="onEdit(tsk)"
        class="grid gap-1 pt-1 my-3 items-center hover:bg-[var(--bg-hover-context)] hover:cursor-pointer"
        :style="{ gridTemplateColumns }"
      >
        <div
          class="min-w-[100px] max-w-[300px] text-center overflow-hidden line-clamp-3 break-words"
          @click="onOpen(tsk)"
        >
          {{ tsk.title }}
        </div>

        <div
          class="min-w-[50px] max-w-[300px] overflow-hidden line-clamp-3 break-words"
          @click="onOpen(tsk)"
        >
          {{ tsk.description }}
        </div>

        <StatusesList
          :disabled="!hasAccess({ task: tsk, roles: ['admin', 'owner'] })"
          :project="project"
          :task="tsk"
        />

        <div
          class="min-w-[50px] max-w-[300px] text-center"
          @click="onOpen(tsk)"
        >
          {{ formatDate(tsk.deadline) }}
        </div>

        <div
          class="min-w-[50px] max-w-[300px] text-center"
          @click="onOpen(tsk)"
        >
          {{ formatDate(tsk.createdAt) }}
        </div>

        <div
          class="min-w-[50px] max-w-[300px] text-center"
          @click="onOpen(tsk)"
        >
          {{ tsk.handler.name }}
        </div>
      </div>
      <NotFound
        v-if="tasks.length === 0"
      />
      <Loading v-if="isLoading"/>
    </template>
  </TablesBase>
</template>
