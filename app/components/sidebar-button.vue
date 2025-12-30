<script setup lang="ts">
const { label, icon, href } = defineProps<{
  label: string;
  icon: string;
  href: string;
  showLabel: boolean;
}>();

const route = useRoute();
</script>

<template>
  <NuxtLink
    :to="href" class="flex flex-nowrap whitespace-nowrap justify-start items-center gap-2 p-2 hover:bg-base-300 hover:cursor-pointer"
    :data-tip="label"
    :class="{ 'bg-base-300': route.path === href,
              'tooltip tooltip-right': !showLabel,
    }"
  >
    <span class="flex"><Icon :name="icon" size="24" /></span>
    <Transition name="fade">
      <span v-if="showLabel">{{ label }}</span>
    </Transition>
  </NuxtLink>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
