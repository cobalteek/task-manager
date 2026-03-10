<script setup lang="ts">
import {useProjectsStore} from "~/stores/projects";
import type {Project} from '~~/types/project'
import {creatorOnly} from "~~/utils/creatorOnly";

const projectsStore = useProjectsStore()

const {isLoading} = projectsStore

const type_ = ref('')
const text = ref('')

const error = ref(false)

const props = defineProps<{
  modelValue: boolean
  project?: Project
  sort: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const form = ref(getEmptyForm())

watch(
  () => props.project,
  (p) => {
    if (!p) {
      form.value = getEmptyForm()
      return
    }
    form.value = {
      title: p?.title ?? '',
      description: p?.description ?? '',
      deadline: p?.deadline
        ? formatForDateTimeLocal(p.deadline)
        : ''
    }
  },
  {immediate: true}
)

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen && !props.project) {
      form.value = getEmptyForm()
    }
  }
)

function getEmptyForm() {
  return {
    title: '',
    description: '',
    deadline: '',
  }
}

function formatForDateTimeLocal(dateString: string) {
  const date = new Date(dateString)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function close() {
  emit('update:modelValue', false)
  form.value = getEmptyForm()
}

async function submit() {
  try {
    let deadline: Date | null = null
    if (form.value.deadline) {
      deadline = new Date(form.value.deadline + ':00')
      const now = Date.now() + 60_000

      const targetTime = new Date(deadline).getTime()

      if (targetTime < now) {
        throw createError({
          statusCode: 401,
          statusMessage: "The deadline cannot be earlier than the creation of the project"
        })
      }
    }
    if (props.project) {
      const prj = props.project
      prj.title = form.value.title
      prj.description = form.value.description
      prj.deadline = form.value.deadline
      await projectsStore.updateProject(prj)
      await projectsStore.fetchAll()
      close()
    } else {
      const created = await projectsStore.createProject(
        form.value.title,
        form.value.description,
        deadline
      )
      if (!created) return
      if (props.sort) {
        await projectsStore.fetchAll()
      }
      else await projectsStore.myFetch()
      close()
    }
  } catch (e: any) {
    type_.value = 'error'
    text.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      'Failed, please check your project details'
    error.value = true
    return
  }
}

async function deleteProject(project: Project) {
  try {
    if (!creatorOnly(project)) {
      throw createError({
        statusCode: 401,
        statusMessage: "Only the creator of the project can delete it."
      })
    }

    await projectsStore.deleteProject(project.id)
    await projectsStore.fetchAll()
    close()
  } catch (e: any) {
    type_.value = 'error'
    text.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      'Failed to delete project'
    error.value = true
    return
  }
}

function resetErrorModal() {
  error.value = false
  text.value = ''
  type_.value = ''
}
</script>

<template>
  <Modal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    class="w-full h-[600px] max-w-[600px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <form @submit.prevent="submit">
      <div class="grid gap-4 mx-2 mt-1 text-xl">
        <div class="flex flex-col justify-center gap-2 text-center">
          <label>Title</label>
          <input
            required
            v-model="form.title"
            class="m-1 rounded-xl w-1/2 mx-auto h-[50px] text-black bg-white  p-1"
          />
        </div>
        <div class="flex flex-col gap-4">
          <label class="text-center">Description</label>
          <textarea
            required
            v-model="form.description"
            class="m-1 rounded-xl h-[150px] text-black bg-white  text-mono p-1"
          />
        </div>
        <div class="flex flex-col gap-4 text-center">
          <label>Deadline</label>
          <input
            v-model="form.deadline"
            class="m-1 rounded-xl w-1/2 mx-auto text-black p-1 bg-white "
            type="datetime-local"
          />
        </div>
        <div class="flex justify-center gap-2 mt-2">
          <button type="submit" class="p-2 border rounded-md">
            Save
          </button>
          <button
            v-if="project"
            type="button"
            class="p-2 border rounded-md"
            @click="deleteProject(project)"
          >
            Delete
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
    <Loading v-if="isLoading"/>
  </Modal>
</template>
