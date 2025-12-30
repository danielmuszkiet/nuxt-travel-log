<script setup lang="ts">
const { error, name, label, type } = defineProps<{
  label: string;
  error?: string;
  name: string;
  type: "text" | "textarea" | "number";
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ label }}
    </legend>
    <Field
      v-if="type === 'text' || type === 'number'"
      :type="type"
      class="input w-full"
      :name="name"
      :class="{ 'input-error': error }"
    />

    <Field
      v-if="type === 'textarea'"
      :as="type"
      class="textarea w-full"
      :name="name"
      :class="{ 'input-error': error }"
    />

    <p v-if="error" class="label text-error">
      {{ error }}
    </p>
  </fieldset>
</template>
