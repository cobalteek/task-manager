<script setup lang="ts">
import { computed } from "vue"
import { formatDate } from "~~/utils/formatDate"
import type { Project } from "~~/types/project"
import type { Task } from "~~/types/task"
import { hasAccess } from "~~/utils/hasAccess"

const props = defineProps<{
  modelValue: boolean
  project: Project
  task?: Task
}>()

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void
}>()

const obj = computed(() => props.task ?? props.project)
</script>

<template>
  <Modal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    class="fixed left-1/2 top-1/2 w-[calc(100%-16px)] max-w-[720px] -translate-x-1/2 -translate-y-1/2"
  >
    <div
      class="max-h-[85vh] overflow-y-auto rounded-2xl bg-[var(--bg-modal)] p-3 sm:p-4 md:p-5"
    >
      <div class="flex flex-col gap-3 sm:gap-4">
        <section class="rounded-2xl bg-[var(--bg-back)] p-3 sm:p-4 shadow-sm">
          <div class="mb-1 text-xs sm:text-sm text-[var(--text-main)]">
            {{ $t('table.title') }}
          </div>
          <div class="break-words text-base font-semibold sm:text-lg">
            {{ obj?.title || '—' }}
          </div>
        </section>

        <section class="rounded-2xl bg-[var(--bg-back)] p-3 sm:p-4 shadow-sm">
          <div class="mb-1 text-xs sm:text-sm text-[var(--text-main)]">
            {{ $t('table.description') }}
          </div>
          <div class="whitespace-pre-wrap break-words text-sm sm:text-base">
            {{ obj?.description || '—' }}
          </div>
        </section>

        <section
          class="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <div class="rounded-2xl bg-[var(--bg-back)] p-3 sm:p-4 shadow-sm">
            <div class="mb-1 text-xs sm:text-sm text-[var(--text-main)]">
              {{ $t('table.createdAt') }}
            </div>
            <div class="break-words text-sm sm:text-base">
              {{ obj?.createdAt ? formatDate(obj.createdAt) : '—' }}
            </div>
          </div>

          <div class="rounded-2xl bg-[var(--bg-back)] p-3 sm:p-4 shadow-sm">
            <div class="mb-1 text-xs sm:text-sm ">
              {{ $t('table.deadline') }}
            </div>
            <div class="break-words text-sm sm:text-base">
              {{ obj?.deadline ? formatDate(obj.deadline) : '—' }}
            </div>
          </div>
        </section>

        <section class="rounded-2xl bg-[var(--bg-back)] p-3 sm:p-4 shadow-sm">
          <div class="mb-2 text-xs sm:text-sm ">
            {{ $t('table.status') }}
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <div v-if="task">
              <StatusesList
                :disabled="!hasAccess({ task: task, roles: ['admin', 'owner'] })"
                :project="project"
                :task="task"
                class="bg-[var(--bg-back)] text-[var(--input-bg)]"
              />
            </div>

            <div v-else>
              <StatusesList
                v-if="project"
                :disabled="!hasAccess({ project, roles: ['owner'] })"
                :project="project"
                class="bg-[var(--bg-back)] text-[var(--input-text)]"
              />
            </div>
          </div>
        </section>

        <section class="rounded-2xl bg-[var(--bg-back)] p-3 sm:p-4 shadow-sm">
          <div class="mb-1 text-xs sm:text-sm">
            {{ $t('table.handler') }}
          </div>
          <div class="break-words text-sm sm:text-base">
            {{ obj?.handler?.name || '—' }}
          </div>
        </section>
      </div>
    </div>
  </Modal>
</template>
