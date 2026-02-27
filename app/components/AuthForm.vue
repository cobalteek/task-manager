<script setup lang="ts" xmlns:peer-checked="http://www.w3.org/1999/xhtml">
const props = defineProps<{
  name: string,
  inputs: readonly Field[];
  modelValue: Model;
  btnName: string;
  disc: string;
  link: string;
  textLink: string;
  sex?: boolean;
}>();

type Field = { key: string; type: string; placeholder: string }
type Model = Record<string, string>

const emit = defineEmits<{
  (e: 'update:modelValue', v: Model): void
  (e: 'submit'): void
}>()

function setValue(key: string, value: string) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

</script>

<template>
  <div class="w-2/6 min-w-[300px] max-w-[330px] max-h-4/6 p-10 bg-[var(--bg-modal)] border border-solid border-neutral rounded-xl flex overflow-hidden">
    <div class="flex mx-auto flex-col justify-between items-center">
      <h4 class="font-bold text-xl mb-2 ">
        {{ props.name }}
      </h4>
      <form @submit.prevent="emit('submit')" class="flex mx-auto flex-col justify-between items-center">
          <input
            v-for="field in props.inputs"
            :key="field.key"
            :value="props.modelValue[field.key] ?? ''"
            @input="setValue(field.key, ($event.target as HTMLInputElement).value)"
            :type="field.type"
            :placeholder="field.placeholder"
            class="p-1 pl-2 w-100 mb-5 rounded-md active:border-gray-600 text-black"/>
        <div v-if="props.sex" class="flex gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="male"
              class="w-3 h-3 rounded-full border-2 border-gray-500
            peer-checked:border-gray-300
            peer-checked:bg-gray-600
            transition"
              :checked="props.modelValue.gender === 'male'"
              @change="setValue('gender', 'male')"
            />
            <span>Male</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="female"
              class="w-3 h-3 rounded-full border-2 border-gray-500
             peer-checked:border-gray-300
            peer-checked:bg-gray-600
            transition"
              :checked="props.modelValue.gender === 'female'"
              @change="setValue('gender', 'female')"
            />
            <span>Female</span>
          </label>
        </div>
        <button type="submit" class="w-1/2 text-bold bg-gray-800 mt-3 rounded-xl p-1 hover:bg-gray-600 transition duration-300">
          {{props.btnName}}
        </button>
      </form>
      <div class="flex flex-col justify-between items-center pt-3 w-full">
        <div>
          {{props.disc}}
        </div>
        <NuxtLink v-if="props.textLink" :to="props.link" class="text-blue-200 hover:bg-gray-600 transition duration-300">
          {{props.textLink}}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
