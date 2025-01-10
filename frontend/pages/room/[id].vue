<script setup lang="ts">
const route = useRoute()
</script>
<template>
  <div>
    <LeafMap :room-id="route.params.id" />
  </div>
</template>
