<template>
  <UDashboardPanel id="pedidos-cocina">
    <template #header>
      <UDashboardNavbar title="Pedidos / Cocina" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <p>Pedidos de cocina</p>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>

</script>
