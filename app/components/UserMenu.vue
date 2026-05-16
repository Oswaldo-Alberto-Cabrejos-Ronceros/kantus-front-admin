<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  collapsed?: boolean
}>()

const { useLogout, displayName, user } = useAuth()

const logoutAction = () => {
  try {
    useLogout()
  } catch (e) {
    console.log(e)
  }
}

const colorMode = useColorMode()

const roleBadgeColor = computed(() => {
  const colors: Record<string, string> = {
    Admin: 'primary',
    Mozo: 'info',
    Cajero: 'success',
    Cocinero: 'warning',
    Delivery: 'secondary'
  }
  return colors[user.value?.role || ''] || 'neutral'
})

const items = computed<DropdownMenuItem[][]>(() => [
  [{
    label: 'Modo',
    icon: 'i-lucide-sun-moon',
    children: [{
      label: 'Claro',
      icon: 'i-lucide-sun',
      type: 'checkbox',
      checked: colorMode.value === 'light',
      onSelect(e: Event) {
        e.preventDefault()
        colorMode.preference = 'light'
      }
    }, {
      label: 'Oscuro',
      icon: 'i-lucide-moon',
      type: 'checkbox',
      checked: colorMode.value === 'dark',
      onUpdateChecked(checked: boolean) {
        if (checked) {
          colorMode.preference = 'dark'
        }
      },
      onSelect(e: Event) {
        e.preventDefault()
      }
    }] }],
  [
    {
      label: 'Cerrar sesión',
      icon: 'i-lucide-log-out',
      onSelect(e: Event) {
        e.preventDefault()
        logoutAction()
      }
    }
  ]
])
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{
      content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)'
    }"
  >
    <UButton
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
    >
      <template #leading>
        <div class="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary font-semibold text-xs ring-1 ring-primary/20">
          {{ user?.name?.charAt(0) || 'U' }}{{ user?.lastname?.charAt(0) || '' }}
        </div>
      </template>
      <template v-if="!collapsed" #default>
        <div class="flex flex-col items-start min-w-0">
          <span class="text-sm font-medium truncate w-full text-left">{{ displayName }}</span>
          <span class="text-[10px] font-medium text-muted uppercase tracking-wider">{{ user?.role || 'Usuario' }}</span>
        </div>
      </template>
      <template v-if="!collapsed" #trailing>
        <UIcon name="i-lucide-chevrons-up-down" class="text-dimmed h-4 w-4" />
      </template>
    </UButton>
  </UDropdownMenu>
</template>
