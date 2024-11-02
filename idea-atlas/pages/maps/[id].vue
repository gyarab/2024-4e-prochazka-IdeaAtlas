<template>
  <div>
    <p>This is the default page for map {{ id }}</p>
    <MapGraph />
    <SigmaGraph />
  </div>
</template>

<script setup lang="ts">
const { id } = useRoute().params;
</script>