<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const open = ref(false)

const links = [
  {
    label: 'Mesas',
    icon: 'i-lucide-layout-grid',
    to: '/mozo/mesas',
    onSelect: () => { open.value = false }
  },
  {
    label: 'Pedidos / Cocina',
    icon: 'i-lucide-cooking-pot',
    to: '/pedidos-cocina',
    onSelect: () => { open.value = false }
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
      class="bg-elevated/25 gradient-sidebar"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
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
