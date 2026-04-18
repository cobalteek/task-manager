<script setup lang="ts">
import type { Project } from "~~/types/project"
import { resetErrorModal } from "~~/utils/resetErrorModal"
import { type ProjectTaskFormApi } from "~~/composables/useProjectTaskForm"
import type { Task } from "~~/types/task"

const props = defineProps<{
  mode: 'create-project' | 'edit-project' | 'create-task' | 'edit-task' | ''
  project: Project | undefined
  task?: Task
  loading?: boolean
  canDelete: boolean
  formApi: ProjectTaskFormApi
}>()

const error = ref(false)
const type_ = ref('')
const text = ref('')

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'delete'): void
  (e: 'cancel'): void
}>()

const usersStore = useUsersStore()
const formApi = props.formApi

const isTaskMode = computed(() =>
  props.mode === 'create-task' || props.mode === 'edit-task'
)
</script>

<template>
  <div>
    <form @submit.prevent="emit('submit')">
      <div
        class="mx-auto w-full max-w-3xl rounded-2xl bg-[var(--bg-modal)] p-4 sm:p-5 md:p-6 shadow-sm"
      >
        <div class="mb-5">
          <h2 class="text-xl sm:text-2xl font-semibold text-center">
            {{
              mode === 'create-project'
                ? $t('btn.addProject')
                : mode === 'edit-project'
                  ? $t('btn.editProject')
                  : mode === 'create-task'
                    ? $t('btn.addTask')
                    : $t('btn.editTask')
            }}
          </h2>
        </div>

        <div class="flex flex-col gap-4 sm:gap-5">
          <section class="rounded-2xl bg-[var(--bg-back)] p-4">
            <label class="mb-2 block text-sm font-medium opacity-80">
              {{ $t('table.title') }}
            </label>
            <input
              v-model="formApi.form.value.title"
              required
              class="w-full rounded-xl border border-transparent bg-white px-4 py-3 text-black outline-none transition
                   focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
            />
          </section>

          <section class="rounded-2xl bg-[var(--bg-back)] p-4 shadow-sm">
            <label class="mb-2 block text-sm font-medium opacity-80">
              {{ $t('table.description') }}
            </label>
            <textarea
              v-model="formApi.form.value.description"
              required
              class="min-h-[140px] w-full resize-none rounded-xl border border-transparent bg-white px-4 py-3 text-black outline-none transition
                   focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
            />
          </section>

          <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="rounded-2xl bg-[var(--bg-back)] p-4 shadow-sm">
              <label class="mb-2 block text-sm font-medium opacity-80">
                {{ $t('table.deadline') }}
              </label>
              <input
                v-model="formApi.form.value.deadline"
                type="datetime-local"
                class="w-full rounded-xl border border-transparent bg-white px-4 py-3 text-black outline-none transition
                     focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div class="rounded-2xl bg-[var(--bg-back)] p-4 shadow-sm">
              <label class="mb-2 block text-sm font-medium opacity-80">
                {{ $t('table.handler') }}
              </label>
              <select
                v-model="formApi.form.value.handlerId"
                class="w-full rounded-xl border border-transparent bg-white px-4 py-3 text-black outline-none transition
                     focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
              >
                <option disabled value="">
                  {{ $t('table.selectHandler') }}
                </option>
                <option
                  v-for="o in usersStore.options"
                  :key="o.value"
                  :value="o.value"
                >
                  {{ o.label }}
                </option>
              </select>
            </div>
          </section>

          <section class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              v-if="canDelete"
              type="button"
              class="rounded-xl border border-red-300 px-4 py-3 font-medium text-red-600 transition hover:scale-[0.98] active:scale-95"
              @click="emit('delete')"
            >
              {{ $t('btn.delete') }}
            </button>

            <button
              type="submit"
              class="rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:scale-[0.98] active:scale-95"
            >
              {{ $t('btn.save') }}
            </button>
          </section>
        </div>
      </div>
    </form>
  </div>

  <ErrorModalContent
    v-model="error"
    :type="type_"
    :text="text"
    @close="resetErrorModal"
  />

  <Loading v-if="loading" />
</template>
