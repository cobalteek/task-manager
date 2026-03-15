<script setup lang="ts">
import type {Project} from "~~/types/project";
import {resetErrorModal} from "~~/utils/resetErrorModal";
import {type ProjectTaskFormApi} from "~~/composables/useProjectTaskForm";
import type {Task} from "~~/types/task";

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

</script>

<template>
  <form
    @submit.prevent="emit('submit')"
  >
    <div class="grid gap-4 mx-2 mt-1 text-xl">
      <div class="flex flex-col justify-center gap-2 text-center">
        <label>{{ $t('table.title') }}</label>
        <input
          required
          v-model="formApi.form.value.title"
          class="m-1 rounded-xl w-1/2 mx-auto h-[50px] text-black bg-white  p-1"
        />
      </div>
      <div class="flex flex-col gap-4">
        <label class="text-center">{{ $t('table.description') }}</label>
        <textarea
          required
          v-model="formApi.form.value.description"
          class="m-1 rounded-xl h-[150px] text-black bg-white  text-mono p-1"
        />
      </div>
      <div class="inline-flex items-center justify-between px-5">
        <div class="flex flex-col gap-4 text-center">
          <label>{{ $t('table.deadline') }}</label>
          <input
            v-model="formApi.form.value.deadline"
            class="m-1 rounded-xl mx-auto text-black p-1 bg-white "
            type="datetime-local"
          />
        </div>
        <div class="flex flex-col gap-4 text-center">
          <label>{{ $t('table.handler') }}</label>
          <select
            v-model="formApi.form.value.handlerId"
          >
            <option disabled value="">
              {{ $t('table.selectHandler') }}
            </option>
            <option
              v-for="o in usersStore.options"
              :key="o.value"
              :value="o.value"
              class="select"
            >
              {{ o.label }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex justify-center gap-2 mt-2">
        <button type="submit" class="p-2 border rounded-md">
          {{ $t('btn.save') }}
        </button>
        <button
          v-if="canDelete"
          type="button"
          class="p-2 border rounded-md"
          @click="emit('delete')"
        >
          {{ $t('btn.delete') }}
        </button>
      </div>
    </div>
  </form>
  <ErrorModalContent
    v-model="error"
    :type="type_"
    :text="text"
    @close="resetErrorModal"
  />
  <Loading v-if="loading" />
</template>
