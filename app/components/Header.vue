<script setup lang="ts">
import {navigateTo} from "nuxt/app";
import {useAuthStore} from "~/stores/auth";
import {storeToRefs} from "pinia";
import ToggleTheme from "~/components/ToggleTheme.vue";

const auth = useAuthStore()
const {user} = storeToRefs(auth)
const {locale, setLocale} = useI18n()
const type_ = ref('')
const text = ref('')
const error = ref(false)

const logout_ = async () => {
  try {
    await auth.logout()
    await navigateTo('/')
  } catch (e: any) {
    type_.value = 'error'
    text.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      $t('error.auth.logout')
    error.value = true
    return
  }
}

type AppLocale = 'ru' | 'en'

const onChangeLocale = async (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as AppLocale
  await setLocale(value)
}

</script>

<template>
  <header class="inline-flex justify-between items-center w-full bg-[var(--bg-header)] text-[var(--text-main)] text-md">
    <div class="inline-flex items-center">
      <NuxtLink class="" to="/">
        <img class="max-w-[100px] theme-logo" src="../assets/logo.png" alt="logo"/>
      </NuxtLink>
      <ClientOnly>
        <div class="inline-flex gap-2">
          <select
            :value="locale"
            class="select"
            @change="onChangeLocale"
          >
            <option
              value="ru"
            >
              {{ $t('locale.ru') }}
            </option>
            <option
              value="en"
            >
              {{ $t('locale.en') }}
            </option>
          </select>
        </div>
        <ToggleTheme/>
      </ClientOnly>
    </div>
    <div class="sm:inline-flex hidden gap-8">
      <NuxtLink to="/docs">
        {{ $t('pages.docs') }}
      </NuxtLink>
      <NuxtLink to="/about">
        {{ $t('pages.about') }}
      </NuxtLink>
      <NuxtLink to="/contact">
        {{ $t('pages.contact') }}
      </NuxtLink>
    </div>
    <div v-if="user" class="gap-2 sm: mr-1 ">
      <NuxtLink to="/dashboard" class="mr-4">
        {{ $t('pages.dashboard') }}
      </NuxtLink>
      <button @click="logout_" class="inline-flex items-center justify-center bg- border rounded p-1 btn sm: mr-4">
        {{ user?.name }}
        <img src="../assets/logout.png" alt="logout" class="theme-logo h-[30px]"/>
      </button>
    </div>
    <div v-else class="inline-flex items-center justify-center gap-2 sm: mr-1">
      <NuxtLink class="sm: mr-1" to="/sign-in">
        {{ $t('auth.signIn') }}
      </NuxtLink>
      <NuxtLink to="/sign-up" class="bg- border-2 rounded p-0.5 sm: mr-1">
        {{ $t('auth.signUp') }}
      </NuxtLink>
    </div>
    <ErrorModalContent
      v-model="error"
      :type="type_"
      :text="text"
    />
  </header>
</template>
