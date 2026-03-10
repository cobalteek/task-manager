<script setup lang="ts">
import {formatDate} from "~~/utils/formatDate";
import type {Project} from "~~/types/project";
import AutoTextArea from "~/components/AutoTextArea.vue";
import {creatorOnly} from "~~/utils/creatorOnly";

defineProps<{
  modelValue: boolean,
  project: Project
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
          Title
        </div>
        <AutoTextArea
          :text="project.title"
          class="w-1/2 text-black text-center rounded-md max-h-[50px] overflow-y-auto bg-white "
        />
      </div>
      <div class="my-auto flex flex-col justify-center items-center w-full">
        <div>
          Description
        </div>
        <AutoTextArea
          :text="project.description"
          class="w-full max-h-[300px] max-w-[550px] resize-none overflow-y-auto rounded-md border p-2 text-black active:border-0 m-1 bg-white "
        />
      </div>
      <section class="inline-flex justify-between items-center w-full px-3 my-auto">
        <div>
          Created At: {{ formatDate(project.createdAt) }}
        </div>
        <div>
          Deadline: {{ formatDate(project.deadline) }}
        </div>
      </section>
      <section class="inline-flex justify-between items-center w-full px-3 my-auto">
        <div class="inline-flex gap-2 items-center">
          <div class="text-[18px]">
            Status:
          </div>
          <StatusesList
            :disabled = !creatorOnly(project)
            :project="project"
          />
        </div>
        <div>
          Created By: {{ project.createdBy.name }}
        </div>
      </section>
    </div>
  </Modal>
</template>
