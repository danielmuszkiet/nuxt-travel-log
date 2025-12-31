<script setup lang="ts">
const { error, name, label, type, disabled } = defineProps<{
  label: string;
  error?: string;
  name: string;
  type: "text" | "textarea" | "number";
  disabled?: boolean;
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
      :disabled="disabled"
    />

    <Field
      v-if="type === 'textarea'"
      :as="type"
      class="textarea w-full"
      :name="name"
      :class="{ 'input-error': error }"
      :disabled="disabled"
    />

    <p v-if="error" class="label text-error">
      {{ error }}
    </p>
  </fieldset>
</template>
