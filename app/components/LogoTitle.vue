<script lang="ts" setup>
defineProps({
  showTitle: Boolean
})
</script>

<template>
  <div class="flex flex-row items-center gap-2 overflow-hidden">
    <img
      src="/image/logo.jpg"
      alt="Kantus"
      class="mx-auto h-8 w-auto lg:mx-0"
    >
    <h3
      v-show="showTitle"
      class="text-lg font-semibold font-display text-primary"
    >
      Kantus
    </h3>
  </div>
</template>
