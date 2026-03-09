<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";

const auth = useAuthStore()
const fields = [
  {key: 'name', type: 'text', placeholder: 'Name'},
  {key: 'email', type: 'email', placeholder: 'Email'},
  {key: 'password', type: 'password', placeholder: 'Password'},
  {key: 'confirmPassword', type: 'password', placeholder: 'Confirm password'}
] as const

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
    textError.value = 'Only English characters allowed'
    modalRef.value = true
    type_.value = 'error'
    return
  } else if (form.value.email === '' ||
    form.value.password === '' ||
    form.value.confirmPassword === '' ||
    form.value.name === ''
  ) {
    textError.value = 'The fields are empty.'
    modalRef.value = true
    type_.value = 'error'
    return
  } else if (form.value.gender === '') {
    textError.value = 'Please select a gender'
    modalRef.value = true
    type_.value = 'error'
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    textError.value = 'Passwords do not match'
    modalRef.value = true
    type_.value = 'error'
    return
  } else if (form.value.password.length < 6) {
    textError.value = 'Password must be at least 6 characters'
    modalRef.value = true
    type_.value = 'info'
    return
  } else if (form.value.name.length < 3) {
    textError.value = 'Name must be at least 3 characters'
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
      alert('Email already exists')
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
    name='Sign Up'
    :inputs="fields"
    :sex="true"
    btn-name="Register"
    disc="Have an account?"
    text-link="Sign in"
    link="/sign-in"
    v-model="form"
    @submit="onRegister"/>
  <ErrorModalContent v-model="modalRef" class="w-[300px] h-[200px] top-[19%]" :type="type_" :text="textError"/>
</template>
