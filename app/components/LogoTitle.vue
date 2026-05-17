<script setup lang="ts">
defineProps({
  showTitle: Boolean
})
</script>

<template>
  <div class="flex flex-row items-center gap-2.5 overflow-hidden">
    <img
      src="/image/logo.jpg"
      alt="Kantus"
      class="mx-auto h-8 w-auto lg:mx-0"
    >
    <div v-show="showTitle" class="flex flex-col">
      <h3 class="text-base font-bold tracking-tight text-highlighted leading-none">
        Kantus
      </h3>
      <span class="text-[10px] font-medium text-muted tracking-widest uppercase">
        Pollería
      </span>
    </div>
  </div>
</template>
