import { defineNuxtPlugin } from "nuxt/app"
import {useAuth} from "../composables/useAuth";

export default defineNuxtPlugin(() => {
  const { fetchUser } = useAuth()
  fetchUser()
})
