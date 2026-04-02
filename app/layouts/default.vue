<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const open = ref(false)

const links = [{
  label: 'Dashboard',
  icon: 'i-lucide-house',
  to: '/admin/inicio',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Gestión de carta',
  icon: 'i-lucide-file-text',
  to: '/admin/documentos',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Pedidos / Cocina',
  icon: 'i-lucide-square-user-round',
  to: '/admin/autores',
  onSelect: () => {
    open.value = false
  }
},
{
  label: 'Cajas',
  icon: 'i-lucide-hospital',
  to: '/admin/departamentos',
  onSelect: () => {
    open.value = false
  }
},
{
  label: 'Inventario',
  icon: 'i-lucide-table-of-contents',
  to: '/admin/categorias',
  onSelect: () => {
    open.value = false
  }
},
{
  label: 'Ingresos',
  icon: 'i-lucide-tags',
  to: '/admin/tags',
  onSelect: () => {
    open.value = false
  } },
{
  label: 'Trabajadores',
  icon: 'i-lucide-user-round-key',
  to: '/admin/usuarios',
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
        <AUserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
