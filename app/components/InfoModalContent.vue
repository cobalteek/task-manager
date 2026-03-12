<script setup lang="ts">
import {formatDate} from "~~/utils/formatDate";
import type {Project} from "~~/types/project";
import AutoTextArea from "~/components/AutoTextArea.vue";
import {hasAccess} from "~~/utils/hasAccess";
import type {Task} from "~~/types/task";

defineProps<{
  modelValue: boolean,
  project?: Project
  task?: Task
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

</script>

<template>
  <Modal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    class="w-full h-[600px] max-w-[600px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <div class="flex flex-col h-full">
      <div class="flex flex-col justify-center items-center w-full my-auto">
        <div>
          {{ $t('project.title') }}
        </div>
        <AutoTextArea
          :text="project?.title"
          class="w-1/2 text-black text-center rounded-md max-h-[50px] overflow-y-auto bg-white "
        />
      </div>
      <div class="my-auto flex flex-col justify-center items-center w-full">
        <div>
          {{ $t('project.description') }}
        </div>
        <AutoTextArea
          :text="project?.description"
          class="w-full max-h-[300px] max-w-[550px] resize-none overflow-y-auto rounded-md border p-2 text-black active:border-0 m-1 bg-white "
        />
      </div>
      <section class="inline-flex justify-between items-center w-full px-3 my-auto">
        <div v-if="project?.createdAt">
          {{ $t('project.createdAt') }}: {{ formatDate(project?.createdAt) }}
        </div>
        <div v-if="project?.deadline">>
          {{ $t('project.deadline') }} {{ formatDate(project?.deadline) }}
        </div>
      </section>
      <section class="inline-flex justify-between items-center w-full px-3 my-auto">
        <div class="inline-flex gap-2 items-center">
          <div class="text-[18px]">
            {{ $t('project.status') }}:
          </div>
          <StatusesList
            v-if="project"
            :disabled ="!hasAccess({project, roles: ['owner']})"
            :project="project"
          />
        </div>
        <div>
          {{ $t('project.createdBy') }}: {{ project?.createdBy.name }}
        </div>
      </section>
    </div>
  </Modal>
</template>
