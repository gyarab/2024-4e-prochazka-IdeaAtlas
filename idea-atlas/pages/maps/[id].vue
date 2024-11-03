<template>
  <div>
    <p>This is the default page for map {{ id }}</p>
    <MapNetwork />
  </div>
</template>

<script setup lang="ts">
import MapNetwork from '~/components/MapNetwork.vue';

const { id } = useRoute().params;
</script>