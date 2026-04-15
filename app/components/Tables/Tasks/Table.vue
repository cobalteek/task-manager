<script setup lang="ts">
import type { Task } from "~~/types/task"
import type { Project } from "~~/types/project"
import { formatDate } from "~~/utils/formatDate"
import { hasAccess } from "~~/utils/hasAccess"
import NotFound from "~/components/NotFound.vue"

defineProps<{
  project: Project
  tasks: Task[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: "open", task: Task): void
  (e: "edit", task: Task): void
}>()

const headers = computed(() => [
  $t("table.title"),
  $t("table.description"),
  $t("table.status"),
  $t("table.deadline"),
  $t("table.createdAt"),
  $t("table.handler"),
])

const taskColumns =
  "minmax(140px, 1.1fr) minmax(180px, 1.3fr) minmax(150px, 1fr) minmax(140px, 1fr) minmax(140px, 1fr) minmax(120px, 0.9fr)"

function onOpen(task: Task) {
  emit("open", task)
}

function onEdit(task: Task) {
  emit("edit", task)
}
</script>

<template>
  <div class="w-full">
    <!-- mobile cards -->
    <div class="flex flex-col gap-3 md:hidden">
      <div
        v-for="tsk in tasks"
        :key="tsk.id"
        class="rounded-2xl border border-gray-200 bg-[var(--bg-modal)] p-3 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <div
            class="min-w-0 flex-1 cursor-pointer"
            @click="onOpen(tsk)"
          >
            <div class="text-sm opacity-70">
              {{ $t("table.title") }}
            </div>
            <div class="break-words text-base font-semibold line-clamp-2">
              {{ tsk.title }}
            </div>
          </div>

          <button
            class="shrink-0 rounded-lg border border-gray-300 px-2 py-1 text-lg leading-none"
            @click="onEdit(tsk)"
          >
            ⋮
          </button>
        </div>

        <div
          class="mt-3 cursor-pointer"
          @click="onOpen(tsk)"
        >
          <div class="text-sm opacity-70">
            {{ $t("table.description") }}
          </div>
          <div class="break-words text-sm line-clamp-3">
            {{ tsk.description || "—" }}
          </div>
        </div>

        <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <div class="mb-1 text-sm opacity-70">
              {{ $t("table.status") }}
            </div>
            <StatusesList
              :disabled="!hasAccess({ task: tsk, roles: ['admin', 'owner'] })"
              :project="project"
              :task="tsk"
            />
          </div>

          <div
            class="cursor-pointer"
            @click="onOpen(tsk)"
          >
            <div class="text-sm opacity-70">
              {{ $t("table.handler") }}
            </div>
            <div class="break-words text-sm">
              {{ tsk.handler?.name || "—" }}
            </div>
          </div>

          <div
            class="cursor-pointer"
            @click="onOpen(tsk)"
          >
            <div class="text-sm opacity-70">
              {{ $t("table.deadline") }}
            </div>
            <div class="text-sm">
              {{ formatDate(tsk.deadline) }}
            </div>
          </div>

          <div
            class="cursor-pointer"
            @click="onOpen(tsk)"
          >
            <div class="text-sm opacity-70">
              {{ $t("table.createdAt") }}
            </div>
            <div class="text-sm">
              {{ formatDate(tsk.createdAt) }}
            </div>
          </div>
        </div>
      </div>

      <NotFound v-if="tasks.length === 0 && !isLoading" />
      <Loading v-if="isLoading" />
    </div>

    <!-- tablet / desktop table -->
    <div class="hidden md:block">
      <div class="overflow-x-auto">
        <div class="min-w-[980px]">
          <TablesBase :headers="headers" :grid-template-columns="taskColumns">
            <template #default="{ gridTemplateColumns }">
              <div
                v-for="tsk in tasks"
                :key="tsk.id"
                class="grid items-center gap-2 my-3 rounded-lg px-2 py-2 hover:bg-[var(--bg-hover-context)] hover:cursor-pointer"
                :style="{ gridTemplateColumns }"
                @contextmenu.prevent.stop="onEdit(tsk)"
              >
                <div
                  class="min-w-0 text-center overflow-hidden line-clamp-3 break-words"
                  @click="onOpen(tsk)"
                >
                  {{ tsk.title }}
                </div>

                <div
                  class="min-w-0 overflow-hidden line-clamp-3 break-words"
                  @click="onOpen(tsk)"
                >
                  {{ tsk.description }}
                </div>

                <div class="min-w-0 flex justify-center">
                  <StatusesList
                    :disabled="!hasAccess({ task: tsk, roles: ['admin', 'owner'] })"
                    :project="project"
                    :task="tsk"
                  />
                </div>

                <div
                  class="min-w-0 text-center"
                  @click="onOpen(tsk)"
                >
                  {{ formatDate(tsk.deadline) }}
                </div>

                <div
                  class="min-w-0 text-center"
                  @click="onOpen(tsk)"
                >
                  {{ formatDate(tsk.createdAt) }}
                </div>

                <div
                  class="min-w-0 text-center break-words"
                  @click="onOpen(tsk)"
                >
                  {{ tsk.handler?.name || "—" }}
                </div>
              </div>

              <NotFound v-if="tasks.length === 0 && !isLoading" />
              <Loading v-if="isLoading" />
            </template>
          </TablesBase>
        </div>
      </div>
    </div>
  </div>
</template>
