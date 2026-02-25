<script setup lang="ts">
const fields: {
  name: keyof Form
  type: string
  placeholder: string
}[] = [
  {
    name: '',
    type: 'email',
    placeholder: 'Email',
    validate: (value) =>
      !value.includes('@') ? 'Некорректный email' : ''},
  {
    name: '',
    type: 'password',
    placeholder: 'Password',
    validate: (value) =>
      value.length < 6 ? 'Минимум 6 символов' : ''
  }
];
function validate() {
  let isValid = true

  fields.forEach(field => {
    const error = field.validate?.(form[field.name])
    errors[field.name] = error || ''
    if (error) isValid = false
  })

  return isValid
}

const form = reactive({ email: '', password: '' })

async function onLogin() {
  await $fetch('/api/auth/login', { method: 'POST', body: form })
  await navigateTo('/dashboard')
}
</script>

<template>
    <AuthForm name="Sign in" :inputs="fields" btn-name="Auth" disc="New to Task Manager?" text-link="Create an account" link="/sign-up"/>
</template>

<style scoped>

</style>
