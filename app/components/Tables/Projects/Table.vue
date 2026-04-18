<script setup lang="ts">
import type {Project} from "~~/types/project"
import {formatDate} from "~~/utils/formatDate"
import {hasAccess} from "~~/utils/hasAccess"
import NotFound from "~/components/NotFound.vue";

defineProps<{
  projects: Project[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: "open", project: Project): void
  (e: "openContextMenu", project: Project, event: MouseEvent): void
}>()

const headers = computed(() => [
  $t("table.title"),
  $t("table.description"),
  $t("table.status"),
  $t("table.deadline"),
  $t("table.createdAt"),
  $t("table.handler"),
])

const projectColumns =
  "minmax(180px, 1fr) minmax(220px, 1fr) minmax(180px, 1fr) minmax(150px, 1fr) minmax(140px, 0.9fr) minmax(150px, 1fr)"

function onOpen(project: Project) {
  emit("open", project)
}
</script>

<template>
  <div class="w-full">
    <!-- mobile cards -->
    <div class="flex flex-col gap-3 md:hidden">
      <div
        v-for="prj in projects"
        :key="prj.id"
        class="rounded-2xl border border-[var(--bg-main)] p-3 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <div
            class="min-w-0 flex-1 cursor-pointer"
            @click="onOpen(prj)"
          >
            <div class="text-sm text-[var(--text-main)]">
              {{ $t("table.title") }}
            </div>
            <div class="break-words text-base font-semibold line-clamp-2">
              {{ prj.title }}
            </div>
          </div>

          <button
            class="shrink-0 rounded-lg border border-[var(--btn-border)] px-2 py-1 text-lg leading-none"
            @click="emit('openContextMenu', prj, $event)"
          >
            ⋮
          </button>
        </div>

        <div
          class="mt-3 cursor-pointer"
          @click="onOpen(prj)"
        >
          <div class="text-sm">
            {{ $t("table.description") }}
          </div>
          <div class="break-words text-sm line-clamp-3">
            {{ prj.description || "—" }}
          </div>
        </div>

        <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <div class="mb-1 text-sm">
              {{ $t("table.status") }}
            </div>
            <StatusesList
              :disabled="!hasAccess({ project: prj, roles: ['owner'] })"
              :project="prj"
            />
          </div>

          <div
            class="cursor-pointer"
            @click="onOpen(prj)"
          >
            <div class="text-sm">
              {{ $t("table.handler") }}
            </div>
            <div class="text-sm break-words">
              {{ prj.handler?.name || "—" }}
            </div>
          </div>

          <div
            class="cursor-pointer"
            @click="onOpen(prj)"
          >
            <div class="text-sm">
              {{ $t("table.deadline") }}
            </div>
            <div class="text-sm">
              {{ formatDate(prj.deadline) }}
            </div>
          </div>

          <div
            class="cursor-pointer"
            @click="onOpen(prj)"
          >
            <div class="text-sm">
              {{ $t("table.createdAt") }}
            </div>
            <div class="text-sm">
              {{ formatDate(prj.createdAt) }}
            </div>
          </div>
        </div>
      </div>
      <NotFound v-if="projects.length === 0 && !isLoading"/>
      <Loading v-if="isLoading"/>
    </div>

    <div class="hidden md:block">
      <TablesBase :headers="headers" :grid-template-columns="projectColumns">
        <template #default="{ gridTemplateColumns }">
          <div
            v-for="prj in projects"
            :key="prj.id"
            class="grid w-full box-border items-center gap-2 my-3 rounded-lg px-2 py-2 hover:bg-[var(--bg-hover-context)] hover:cursor-pointer"
            :style="{ gridTemplateColumns }"
            @contextmenu.prevent.stop="emit('openContextMenu', prj, $event)"
          >
            <div
              class="min-w-0 text-center overflow-hidden line-clamp-3 break-words"
              @click="onOpen(prj)"
            >
              {{ prj.title }}
            </div>

            <div
              class="min-w-0 overflow-hidden line-clamp-3 break-words"
              @click="onOpen(prj)"
            >
              {{ prj.description }}
            </div>

            <div class="min-w-0 flex justify-center">
              <StatusesList
                :disabled="!hasAccess({ project: prj, roles: ['owner'] })"
                :project="prj"
              />
            </div>

            <div
              class="min-w-0 text-center"
              @click="onOpen(prj)"
            >
              {{ formatDate(prj.deadline) }}
            </div>

            <div
              class="min-w-0 text-center"
              @click="onOpen(prj)"
            >
              {{ formatDate(prj.createdAt) }}
            </div>

            <div
              class="min-w-0 text-center break-words"
              @click="onOpen(prj)"
            >
              {{ prj.handler?.name || "—" }}
            </div>
          </div>
          <NotFound v-if="projects.length === 0 && !isLoading"/>
          <Loading v-if="isLoading"/>
        </template>
      </TablesBase>
    </div>
  </div>
</template>
