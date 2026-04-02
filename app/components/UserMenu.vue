<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  collapsed?: boolean
}>()

const user = ref({
  name: '',
  avatar: {
    icon: 'i-lucide-user-round'
  }
})

const logoutAction = () => {
  try {
    console.log('Logout action triggered')
  } catch (e) {
    console.log(e)
  }
}

const backToLanding = () => {
  navigateTo('/')
}

const colorMode = useColorMode()

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
  ],
  [{
    label: 'Volver al inicio',
    icon: 'i-lucide-home',
    onSelect: backToLanding
  }]
])

// for show user name
onMounted(() => {
  user.value.name = 'Usuario'
})
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
      v-bind="{
        ...user,
        label: collapsed ? undefined : user?.name,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
    />

    <template #chip-leading="{ item }">
      <div class="inline-flex size-5 shrink-0 items-center justify-center">
        <span
          class="ring-bg size-2 rounded-full bg-(--chip-light) ring dark:bg-(--chip-dark)"
          :style="{
            '--chip-light': `var(--color-${(item as any).chip}-500)`,
            '--chip-dark': `var(--color-${(item as any).chip}-400)`
          }"
        />
      </div>
    </template>
  </UDropdownMenu>
</template>
