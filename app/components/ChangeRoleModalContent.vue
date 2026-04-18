<script setup lang="ts">
import { useUsersStore } from "~/stores/users"
import { useRolesStore } from "~/stores/role"
import { useAuthStore } from "~/stores/auth"
import { storeToRefs } from "pinia"

const usersStore = useUsersStore()
const roleStore = useRolesStore()
const auth = useAuthStore()

const { loading: isLoading, items: users} = storeToRefs(usersStore)
const { user } = storeToRefs(auth)

const filteredUserOptions = computed(() =>
  usersStore.options.filter(u => u.value !== user.value?.id)
)

const candidate = ref('')
const role = ref<number | null>(null)
const type_ = ref('')
const text = ref('')
const error = ref(false)

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

watch(
  () => props.modelValue,
  async (v) => {
    if (v) {
      candidate.value = ''
      role.value = null
      try {
        await Promise.all([
          usersStore.fetchUsers(undefined, { force: true }),
          roleStore.fetchAll()
        ])
      } catch (e: any) {
        type_.value = 'error'
        text.value =
          e?.data?.statusMessage ||
          e?.data?.message ||
          e?.message ||
          $t('error.user.loadUsers')
        error.value = true
      }
    }
  }
)

const selectedUser = computed(() => {
  return users.value.find(user => user.id === candidate.value)
})

watchEffect(() => {
  role.value = selectedUser?.value?.role.id ?? null
})

function close() {
  emit('update:modelValue', false)
}

async function addRole() {
  if (!candidate.value || role.value === null) {
    type_.value = 'info'
    text.value = $t('error.user.chooseUserAndRole')
    error.value = true
    return
  }

  try {
    await roleStore.changeRole(candidate.value, role.value)
    await usersStore.fetchUsers(undefined, { force: true })
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
    class="w-[calc(100%-16px)] max-w-[520px]"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="w-full p-4 sm:p-5 md:p-6">
      <div class="flex flex-col gap-5">
        <div class="text-center">
          <h2 class="text-xl sm:text-2xl font-semibold">
            {{ $t('btn.changeRole') }}
          </h2>
          <p class="mt-1 text-sm opacity-70">
            {{ $t('select.selectUser') }} / {{ $t('select.selectRole') }}
          </p>
        </div>

        <Loading v-if="isLoading" />

        <div class="flex flex-col gap-4">
          <section class="rounded-2xl bg-[var(--bg-back)] p-4">
            <label class="mb-2 block text-sm font-medium opacity-80">
              {{ $t('select.selectUser') }}
            </label>
            <select
              v-model="candidate"
              class="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-context)] px-4 py-3 text-[var(--text-main)] outline-none transition
                     focus:border-[var(--border-main)/20]"
            >
              <option disabled value="">
                {{ $t('select.selectUser') }}
              </option>
              <option
                v-for="o in filteredUserOptions"
                :key="o.value"
                :value="o.value"
              >
                {{ o.label }}
              </option>
            </select>
          </section>

          <section class="rounded-2xl bg-[var(--bg-back)] p-4">
            <label class="mb-2 block text-sm font-medium opacity-80">
              {{ $t('select.selectRole') }}
            </label>
            <select
              v-model.number="role"
              class="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-context)] px-4 py-3 text-[var(--text-main)] outline-none transition
              focus:border-[var(--border-main)/20]"
            >
              <option disabled :value="null">
                {{ $t('select.selectRole') }}
              </option>
              <option
                v-for="o in roleStore.options"
                :key="o.value"
                :value="o.value"
              >
                {{ $t(`role.${o.label}`) }}
              </option>
            </select>
          </section>
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            @click="addRole"
            :disabled="!candidate  || !role"
            class="rounded-xl border border-[var(--btn-border)] bg-[var(--btn-bg)] px-5 py-3 font-medium text-[var(--text-main)] transition
                  disabled:cursor-not-allowed disabled:opacity-50 hover:scale-[0.98] active:scale-95"
          >
            {{ $t('btn.set') }}
          </button>
        </div>
      </div>
    </div>

    <ErrorModalContent v-model="error" :type="type_" :text="text" />
  </Modal>
</template>
