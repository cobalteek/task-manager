<script setup lang="ts">
import {useUsersStore} from "~~/stores/users";

const usersStore = useUsersStore()
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

watch(
  () => props.modelValue,
  (v) => {
    if (v) usersStore.fetchUsers()
  }
)

function close() {
  emit('update:modelValue', false)
}

const candidate = ref('')
async function addAdmin() {
  const id = 2
  await $fetch('/api/changeRole', {
    method: "POST",
    body: {candidate: candidate.value, id: id}
  })
  close()
}

</script>

<template>
  <Modal
    class="w-[300px] h-[200px]"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class=" inline-flex justify-center items-center w-full h-full gap-2">
      <div>
        <div v-if="usersStore.loading">Loading...</div>
        <div v-else-if="usersStore.error">{{ usersStore.error }}</div>
        <select
          v-else
          v-model="candidate"
          class="text-gray-100 bg-[var(--bg-context)] rounded-md p-1 border border-gray-100"
        >
          <option disabled value>Select user</option>
          <option
            v-for="o in usersStore.options"
            :key="o.value"
            :value="o.value"
          >
            {{ o.label }}
          </option>
        </select>
      </div>
      <button
        @click="addAdmin"
        class="rounded-md p-1 border border-gray-100"
      >
        Give Admin
      </button>
    </div>
  </Modal>
</template>
