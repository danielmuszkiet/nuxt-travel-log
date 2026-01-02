<script setup lang="ts">
import type { FetchError } from "ofetch";

import { InsertLocationSchema } from "~~/server/lib/db/schema";

const { $csrfFetch } = useNuxtApp();

const submitError = ref("");
const submitted = ref(false);
const loading = ref(false);
const router = useRouter();

const { handleSubmit, errors, meta, setErrors } = useForm({
  validationSchema: toTypedSchema(InsertLocationSchema),
});

const onSubmit = handleSubmit(async (value) => {
  try {
    submitError.value = "";
    loading.value = true;

    await $csrfFetch("/api/locations", { method: "POST", body: value });
    submitted.value = true;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data.data);
    }
    console.log(e);

    submitError.value = error.statusMessage || "An unknown error occured.";
  }
  finally {
    loading.value = false;
  }
});

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are your sure you want to leave? All unsaved changes will be lost");
    if (!confirm) {
      return false;
    }
  }
  return true;
});
</script>

<template>
  <div class="container max-w-md mx-auto p-4">
    <div>
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be a city, country,
        state or point of interest. You can add specific times you visited this location after adding it.
      </p>

      <div v-if="submitError" role="alert" class="alert alert-error mt-3">
        <Icon name="tabler:exclamation-circle" size="24" />
        <span>{{ submitError }}</span>
      </div>

      <form class="mt-2 flex flex-col gap-2" @submit.prevent="onSubmit">
        <AppFormField
          label="Name"
          :error="errors.name"
          type="text"
          name="name"
          :disabled="loading"
        />

        <AppFormField
          label="Description"
          :error="errors.description"
          type="textarea"
          name="description"
          :disabled="loading"
        />

        <AppFormField
          label="Latitude"
          :error="errors.lat"
          type="number"
          name="lat"
          :disabled="loading"
        />

        <AppFormField
          label="Longitude"
          :error="errors.long"
          type="number"
          name="long"
          :disabled="loading"
        />

        <div class="flex justify-end gap-2">
          <button
            :disabled="loading"
            type="button"
            class="btn btn-outline"
            @click="router.back"
          >
            <Icon name="tabler:arrow-left" size="20" />
            Cancel
          </button>
          <button :disabled="loading" type="submit" class="btn btn-primary">
            Add
            <span v-if="loading" class="loading loading-spinner loading-sm" />
            <Icon v-else name="tabler:circle-plus-filled" size="20" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
