<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";

const auth = useAuthStore()
const fields = [
  {key: 'email', type: 'email', placeholder: 'form.placeholder.email'},
  {key: 'password', type: 'password', placeholder: 'form.placeholder.password'},
] as const

const form = ref({
  email: '',
  password: '',
})

const modalRef = ref(false);
const textError = ref('')
const type_ = ref('')

async function onLogin() {

  if (form.value.email === '' && form.value.password === '') {
    type_.value = 'error'
    textError.value = $t('error.form.fieldsEmpty')
    modalRef.value = true
    return
  } else if (form.value.password.length < 6) {
    type_.value = 'info'
    textError.value = $t('error.auth.passwordLength')
    modalRef.value = true
    return
  }

  try {
    await auth.signIn(form.value)

    await navigateTo('/dashboard')
  } catch (e: any) {
    if (e.response && e.response.status === 401) {
      type_.value = 'error'
      textError.value = $t('.auth.loginOrPasswordInvalid')
      modalRef.value = true
    }
  }
}

function resetErrorModal() {
  modalRef.value = false
  textError.value = ''
  type_.value = ''
}

definePageMeta({
  middleware: [
    'guest',
  ],
})
</script>

<template>
  <AuthForm
    :name="$t('auth.signIn')"
    :inputs="fields"
    :btn-name="$t('auth.signIn')"
    :disc="$t('auth.noAccount')"
    :text-link="$t('auth.signUp')"
    link="/sign-up"
    v-model="form"
    @submit="onLogin"
  />
  <ErrorModalContent
    :model-value="modalRef"
    :type="type_"
    :text="textError"
    @close="resetErrorModal"
    class="w-[300px] h-[200px] top-1/4"
  />
</template>
