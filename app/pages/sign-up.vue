<script setup lang="ts">
const fields: {
  name: keyof Form
  type: string
  placeholder: string
}[]   = [
  {name: '', type: 'text', placeholder: 'Name'},
  {name: '', type: 'text', placeholder: 'Last Name'},
  {name: '', type: 'email', placeholder: 'Email'},
  {name: '', type: 'password', placeholder: 'Password'},
  {name: '', type: 'password', placeholder: 'Confirm password'},
]

const form = reactive({ email: '', password: '', name: '' })

async function onRegister() {
  await $fetch('/api/auth/register', { method: 'POST', body: form })
  // обычно после регистрации — сразу логин
  await $fetch('/api/auth/login', { method: 'POST', body: { email: form.email, password: form.password } })
  await navigateTo('/dashboard')
}
</script>

<template>
  <AuthForm name='Sign Up' :inputs="fields" :sex="true" btn-name="Register" disc="Have an account?" text-link="Sign in" link="/sign-in"/>
</template>

<style scoped>

</style>
