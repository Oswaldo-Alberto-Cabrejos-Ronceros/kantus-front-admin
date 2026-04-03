<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const open = ref(false)

const links = [{
  label: 'Inicio',
  icon: 'i-lucide-house',
  to: '/',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Gestión de carta',
  icon: 'i-lucide-receipt-text',
  to: '/gestion-carta',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Pedidos / Cocina',
  icon: 'i-lucide-cooking-pot',
  to: '/pedidos-cocina',
  onSelect: () => {
    open.value = false
  }
},
{
  label: 'Cajas',
  icon: 'i-lucide-hand-coins',
  to: '/cajas',
  onSelect: () => {
    open.value = false
  }
},
{
  label: 'Inventario',
  icon: 'i-lucide-archive',
  to: '/inventario',
  onSelect: () => {
    open.value = false
  }
},
{
  label: 'Ingresos',
  icon: 'i-lucide-banknote',
  to: '/ingresos',
  onSelect: () => {
    open.value = false
  } },
{
  label: 'Trabajadores',
  icon: 'i-lucide-square-user-round',
  to: '/trabajadores',
  onSelect: () => {
    open.value = false
  }
}
] as NavigationMenuItem[]
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25 transition-all duration-300"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <!-- icon -->
        <LogoTitle :show-title="!collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
