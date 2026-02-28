<script setup lang="ts">
import {useAuthStore} from "~~/stores/auth";

const auth = useAuthStore()
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

  try {
    await auth.signIn(form.value)

    await navigateTo('/dashboard')
  } catch (e) {
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
