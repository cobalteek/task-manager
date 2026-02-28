<script setup lang="ts">
import {useAuthStore} from "~~/stores/auth";

const auth = useAuthStore()
const fields = [
  { key: 'name', type: 'text', placeholder: 'Name' },
  { key: 'email', type: 'email', placeholder: 'Email' },
  { key: 'password', type: 'password', placeholder: 'Password' },
  { key: 'confirmPassword', type: 'password', placeholder: 'Confirm password' }
] as const

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: ''
})

async function onRegister() {
  if (form.value.password !== form.value.confirmPassword) {
    alert('Passwords do not match')
    return
  }

  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { name: form.value.name, email: form.value.email, password: form.value.password },
    })

    // опционально: сразу логин
    await auth.signIn(form.value)

    await navigateTo('/dashboard')
  } catch (e: any) {

    const status = e?.statusCode || e?.status || e?.response?.status
    const message = e?.data?.message || e?.message || 'Registration failed'

    if (status === 409) {
      alert('Этот email уже зарегистрирован. Попробуй Sign in.')
      return
    }

    alert(message)
    console.error(e)
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
</template>
