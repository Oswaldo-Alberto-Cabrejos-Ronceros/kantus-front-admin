<template>
  <UDashboardPanel id="pedidos">
    <template #header>
      <UDashboardNavbar title="Pedidos" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 pb-4">
        <UPageGrid class="ap-4 sm:gap-6 lg:gap-px grid-cols-1 lg:grid-cols-2">
          <UPageCard
            variant="subtle"
            class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
            icon="i-lucide-cooking-pot"
            title="Entregados"
            description="4"
          />
          <UPageCard
            variant="subtle"
            class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
            icon="i-lucide-motorbike"
            title="Pendientes"
            description="2"
          />
        </UPageGrid>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>

</script>
