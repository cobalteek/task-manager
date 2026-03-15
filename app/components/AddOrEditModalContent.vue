<script setup lang="ts">
import type { Project } from '~~/types/project'
import type { Task } from '~~/types/task'
import { computed, ref } from 'vue'
import { hasAccess } from '~~/utils/hasAccess'
import { useProjectTaskAction } from '~~/composables/useProjectTaskAction'
import {type ProjectTaskFormApi} from '~~/composables/useProjectTaskForm'
import {useProjectTaskModalState} from "~~/composables/useProjectTaskModalState";
import {useUsersStore} from "#imports";

const type_ = ref('')
const text = ref('')
const error = ref(false)

const props = defineProps<{
  modelValue: boolean
  mode: 'create-project' | 'edit-project' | 'create-task' | 'edit-task' | ''
  project?: Project | undefined
  task?: Task
  sort: boolean
  formApi: ProjectTaskFormApi
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const usersStore = useUsersStore()

const action = useProjectTaskAction(props)

const formApi = props.formApi

const canDelete = computed(() =>
  hasAccess({
    project: props.project,
    task: props.task,
    roles: ['admin', 'owner']
  })
)

function close() {
  emit('update:modelValue', false)
}

async function onSubmit() {
  try {
    await action.submit(props, formApi)
    props.formApi.resetForm()
    close()
  } catch (e: any) {
    type_.value = 'error'
    text.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      $t('error.project.addEdit')
    error.value = true
  }
}

async function onDelete() {
  try {
    await action.deleteItem(props)
    props.formApi.resetForm()
    close()
  } catch (e: any) {
    type_.value = 'error'
    text.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      $t('error.project.delete')
    error.value = true
  }
}

function onResetErrorModal() {
  error.value = false
  text.value = ''
  type_.value = ''
}

useProjectTaskModalState(
  props,
  usersStore,
  {
    resetForm: formApi.resetForm,
    fillFromProject: formApi.fillFromProject,
    fillFromTask: formApi.fillFromTask
  }
)
</script>

<template>
  <AddOrEditEntityModal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <ProjectTaskForm
      :mode="mode"
      :project="project"
      :task="task"
      :can-delete="canDelete"
      :formApi="formApi"
      @submit="onSubmit"
      @delete="onDelete"
    />
  </AddOrEditEntityModal>

  <ErrorModalContent
    v-model="error"
    :type="type_"
    :text="text"
    @close="onResetErrorModal"
  />
</template>
