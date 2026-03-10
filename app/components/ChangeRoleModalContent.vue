<script setup lang="ts">
import {useUsersStore} from "~/stores/users";
import {useRolesStore} from "~/stores/role";
import {useAuthStore} from "~/stores/auth";


const usersStore = useUsersStore()
const roleStore = useRolesStore()
const auth = useAuthStore()

const { isLoading } = storeToRefs(usersStore)

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
      try {
        usersStore.fetchUsers()
        roleStore.fetchAll()
      } catch (e: any) {
        type_.value = 'error'
        text.value = e?.data?.message || e?.message || $t('error.user.loadUsers')
        error.value = true
      }
    }
  }
)

function close() {
  emit('update:modelValue', false)
}

async function addRole() {
  if (candidate.value == '' || !role.value) {
    type_.value = 'info'
    text.value = $t('error.user.chooseUserAndRole')
    error.value = true
    return
  }
  try {
    await roleStore.changeRole(candidate.value, role.value)
    await auth.fetchMe()
    close()
  } catch (e: any) {
    console.error(e)
    type_.value = 'error'
    text.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      $t('error.user.assignRole')
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
        <Loading v-if="isLoading"/>
        <div class="inline-flex items-center justify-center w-full gap-3">
          <select
            v-model="candidate"
            class="text-gray-100 bg-[var(--bg-context)] rounded-md p-1 border border-gray-100"
          >
            <option disabled value>{{$t('select.selectUser')}}</option>
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
            <option disabled value>{{$t('select.selectRole')}}</option>
            <option
              v-for="o in roleStore.options"
              :key="o.value"
              :value="o.value"
            >
              {{ $t(`role.${o.label}`) }}
            </option>
          </select>
        </div>
        <div class="flex items-center justify-center w-full ">
          <button
            @click="addRole"
            class="rounded-md p-1 border border-gray-100"
          >
            {{$t('btn.set')}}
          </button>
        </div>
      </div>
    </div>
    <ErrorModalContent v-model="error" :type="type_" :text="text"/>
  </Modal>
</template>
