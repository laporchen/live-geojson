<script setup lang="ts">
const { initWs } = useWs()

onMounted(() => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const ws = initWs(protocol)
  ws.on('status', event => {
    console.log(event.status)
  })
})
</script>
<template>
  <div>
  </div>
</template>
