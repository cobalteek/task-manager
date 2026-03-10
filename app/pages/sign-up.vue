<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";

const auth = useAuthStore()
const {t} = useI18n()
const fields = computed(() => [
  {key: 'name', type: 'text', placeholder: t('form.placeholder.name')},
  {key: 'email', type: 'email', placeholder: t('form.placeholder.email')},
  {key: 'password', type: 'password', placeholder: t('form.placeholder.password')},
  {key: 'confirmPassword', type: 'password', placeholder: t('form.placeholder.confirmPassword')},
] as const)

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
  role: ''
})

const modalRef = ref(false);
const textError = ref('')

function validate(text: string) {
  if (!text) {
    return false
  }
  return !/^[\x20-\x7E]+$/.test(text);

}

const type_ = ref('error')

async function onRegister() {
  if (validate(form.value.password) || validate(form.value.name)) {
    textError.value = $t('error.auth.onlyEnglish')
    modalRef.value = true
    type_.value = 'error'
    return
  } else if (form.value.email === '' ||
    form.value.password === '' ||
    form.value.confirmPassword === '' ||
    form.value.name === ''
  ) {
    textError.value = $t('error.form.fieldsEmpty')
    modalRef.value = true
    type_.value = 'error'
    return
  } else if (form.value.gender === '') {
    textError.value = $t('error.auth.selectGender')
    modalRef.value = true
    type_.value = 'error'
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    textError.value = $t('error.auth.passwordNotMatch')
    modalRef.value = true
    type_.value = 'error'
    return
  } else if (form.value.password.length < 6) {
    textError.value = $t('error.auth.passwordLength')
    modalRef.value = true
    type_.value = 'info'
    return
  } else if (form.value.name.length < 3) {
    textError.value = $t('error.auth.nameLength')
    modalRef.value = true
    type_.value = 'error'
    return
  }

  try {
    await auth.signUp(form.value)

    await auth.signIn(form.value)

    await navigateTo('/dashboard')
  } catch (e: any) {

    const status = e?.statusCode || e?.status || e?.response?.status

    if (status === 409) {
      alert($t('error.auth.emailExist'))
      return
    }
  }
}

definePageMeta({
  middleware: [
    'guest',
  ],
})
</script>

<template>
  <AuthForm
    :name="$t('auth.signUp')"
    :inputs="fields"
    :sex="true"
    :btn-name="$t('auth.signUp')"
    :disc="$t('auth.haveAccount')"
    :text-link="$t('auth.signIn')"
    link="/sign-in"
    v-model="form"
    @submit="onRegister"/>
  <ErrorModalContent v-model="modalRef" class="w-[300px] h-[200px] top-[19%]" :type="type_" :text="textError"/>
</template>
