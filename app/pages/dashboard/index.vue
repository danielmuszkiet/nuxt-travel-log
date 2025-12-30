<script setup lang="ts">
const isSidebarOpen = ref(true);

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}
</script>

<template>
  <div class="flex-1 flex">
    <div
      class="bg-base-100 transition-all duration-400 border-r border-base-200"
      :class="{ 'overflow-hidden w-64': isSidebarOpen, 'w-10': !isSidebarOpen }"
    >
      <div
        class="flex justify-end hover:cursor-pointer py-2 h-10 transition-transform duration-400"
        :class="{ '-translate-x-2': !isSidebarOpen }"
        @click="toggleSidebar"
      >
        <Icon v-if="isSidebarOpen" name="tabler:layout-sidebar-left-collapse-filled" size="24" />
        <Icon v-else name="tabler:layout-sidebar-left-expand-filled" size="24" />
      </div>
      <div class="flex flex-col gap-1">
        <SidebarButton :show-label="isSidebarOpen" label="Locations" icon="tabler:map" href="/dashboard" />
        <SidebarButton :show-label="isSidebarOpen" label="Add Locations" icon="tabler:circle-plus-filled" href="/dashboard/add" />

        <div class="divider" />

        <SidebarButton :show-label="isSidebarOpen" label="Sign Out" icon="tabler:logout-2" href="/sign-out" />
      </div>
    </div>

    <div class="flex-1 p-2">
      <h1>main content </h1>
    </div>
  </div>
</template>
