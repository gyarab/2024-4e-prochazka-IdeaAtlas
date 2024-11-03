<template>
  <div>
    <MapNetwork />
  </div>
</template>

<script setup lang="ts">
import MapNetwork from '~/components/MapNetwork.vue';

const { id } = useRoute().params;
// {{id}}
</script>