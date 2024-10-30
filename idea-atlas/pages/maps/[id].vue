<template>
    <div>
      <p>This is the default page for map {{ id }}</p>
      <MapGraph />
    </div>
  </template>
  
  <script setup lang="ts">
import MapGraph from '~/components/MapGraph.vue';

  const {id} = useRoute().params;
  </script>