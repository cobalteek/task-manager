<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";

const auth = useAuthStore()
const fields = [
  { key: 'email', type: 'email', placeholder: 'Email' },
  { key: 'password', type: 'password', placeholder: 'Password' },
] as const

const form = ref({
  email: '',
  password: '',
})

const modalRef = ref(false);
const textError = ref('')

async function onLogin() {
  console.log('LOGIN BODY:', form.value)

  if(form.value.email === '' && form.value.password === '') {
    textError.value = 'The fields are empty.'
    modalRef.value = true
    return
  }
  else if(form.value.password.length < 6) {
    textError.value = 'Password must be at least 6 characters'
    modalRef.value = true
    return
  }

  try {
    await auth.signIn(form.value)

    await navigateTo('/dashboard')
  } catch (e) {
    if (e.response && e.response.status === 401) {
      textError.value = 'The login or password is incorrect. Please try again.'
      modalRef.value = true
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
    name="Sign In"
    :inputs="fields"
    btn-name="Login"
    disc="No account?"
    text-link="Sign up"
    link="/sign-up"
    v-model="form"
    @submit="onLogin"
  />
  <ErrorModalContent head="Error" type="error" :text="textError" class="w-[300px] h-[200px] top-1/4"/>
</template>
