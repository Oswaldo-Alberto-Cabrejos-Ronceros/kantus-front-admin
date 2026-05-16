<script setup lang="ts">
defineProps({
  showTitle: Boolean
})
</script>

<template>
  <div class="flex flex-row items-center gap-2.5 overflow-hidden">
    <div class="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-500/20">
      <span class="text-white font-black text-lg leading-none">K</span>
    </div>
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
