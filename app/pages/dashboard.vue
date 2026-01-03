<script setup lang="ts">
const isSidebarOpen = ref(true);
const sidebarStore = useSidebarStore();
const locationStore = useLocationStore();

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") !== "false";
  locationStore.refresh();
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
        <SidebarButton
          :show-label="isSidebarOpen"
          label="Locations"
          icon="tabler:map"
          href="/dashboard"
        />
        <SidebarButton
          :show-label="isSidebarOpen"
          label="Add Locations"
          icon="tabler:circle-plus-filled"
          href="/dashboard/add"
        />

        <div v-show="sidebarStore.isLoading || sidebarStore.sidebarItems.length" class="divider" />

        <div v-show="sidebarStore.isLoading" class="px-2">
          <div class="skeleton h-7 " />
        </div>

        <div v-show="sidebarStore.sidebarItems.length" class="flex flex-col">
          <ClientOnly>
            <SidebarButton
              v-for="item in sidebarStore.sidebarItems"
              :key="item.id"
              :label="item.label"
              :icon="item.icon"
              :href="item.href"
              :show-label="isSidebarOpen"
            />
          </ClientOnly>
        </div>

        <div class="divider" />

        <SidebarButton
          :show-label="isSidebarOpen"
          label="Sign Out"
          icon="tabler:logout-2"
          href="/sign-out"
        />
      </div>
    </div>

    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>
