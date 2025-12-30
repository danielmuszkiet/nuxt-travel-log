<script setup lang="ts">
import { InsertLocationSchema } from "~~/server/lib/db/schema";

const router = useRouter();

const { handleSubmit, errors, meta } = useForm({
  validationSchema: toTypedSchema(InsertLocationSchema),
});

const onSubmit = handleSubmit(() => {

});

onBeforeRouteLeave(() => {
  if (meta.value.dirty) {
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
      <form class="mt-2 flex flex-col gap-2" @submit.prevent="onSubmit">
        <AppFormField
          label="Name"
          :error="errors.name"
          type="text"
          name="name"
        />

        <AppFormField
          label="Description"
          :error="errors.description"
          type="textarea"
          name="desription"
        />

        <AppFormField
          label="Latitude"
          :error="errors.name"
          type="number"
          name="lat"
        />

        <AppFormField
          label="Longitude"
          :error="errors.name"
          type="number"
          name="long"
        />

        <div class="flex justify-end gap-2">
          <button type="button" class="btn btn-outline" @click="router.back">
            <Icon name="tabler:arrow-left" size="20" />
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Add
            <Icon name="tabler:circle-plus-filled" size="20" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
