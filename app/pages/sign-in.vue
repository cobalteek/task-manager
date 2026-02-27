<script setup lang="ts">
import { useAuth } from '~~/composables/useAuth'

const { login } = useAuth()
const fields = [
  { key: 'email', type: 'email', placeholder: 'Email' },
  { key: 'password', type: 'password', placeholder: 'Password' },
] as const

const form = ref({
  email: '',
  password: '',
})

async function onLogin() {
  console.log('LOGIN BODY:', form.value)

  await login(form.value.email, form.value.password)

  await navigateTo('/dashboard')
}
</script>

<template>
  <AuthForm
    name="Sign In"
    :inputs="fields"
    btn-name="Login"
    disc="No account?"
    text-link="Sign up"
    link="/sign-up"
    v-model="form"
    @submit="onLogin"
  />
</template>
