<script setup lang="ts">
import {useUsersStore} from "~/stores/users";
import {useRolesStore} from "~/stores/role";


const usersStore = useUsersStore()
const roleStore = useRolesStore()

const candidate = ref('')
const role = ref()
const type_ = ref('')
const text = ref('')

const error = ref(false)

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      usersStore.fetchUsers()
      roleStore.fetchAll()
    }
  }
)

function close() {
  emit('update:modelValue', false)
}

async function addRole() {
  if(candidate.value == '' || !role.value) {
    type_.value = 'info'
    text.value = 'Choose user and role'
    error.value = true
    return
  }
  try {
    await roleStore.changeRole(candidate.value, role.value)
    close()
  } catch (e) {
    console.error(e)
    type_.value = 'error'
    text.value = 'Couldn\'t assign a role'
    error.value = true
  }
}

</script>

<template>
  <Modal
    class="w-[300px] h-[200px]"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="w-full h-full mt-5">
      <div class="flex flex-col justify-center items-center w-full h-full gap-5">
        <div v-if="usersStore.loading">Loading...</div>
        <div v-else-if="usersStore.error">{{ usersStore.error }}</div>
        <div class="inline-flex items-center justify-center w-full gap-3">
            <select
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
            <select
              v-model="role"
              class="text-gray-100 bg-[var(--bg-context)] rounded-md p-1 border border-gray-100"
            >
              <option disabled value>Select role</option>
              <option
                v-for="o in roleStore.options"
                :key="o.value"
                :value="o.value"
              >
                {{ o.label }}
              </option>
            </select>
          </div>
          <div class="flex items-center justify-center w-full ">
            <button
              @click="addRole"
              class="rounded-md p-1 border border-gray-100"
            >
              Set
            </button>
          </div>
        </div>
    </div>
    <ErrorModalContent v-model="error" :type="type_" :text="text" />
  </Modal>
</template>
