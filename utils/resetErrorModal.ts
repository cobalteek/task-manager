const error = ref(false)
const text = ref('')
const type_ = ref('')
export function resetErrorModal() {
  error.value = false
  text.value = ''
  type_.value = ''
}
