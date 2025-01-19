<script setup lang="ts">
  import MapNetwork from '~/components/MapNetwork.vue';

  const { id } = useRoute().params;
  const stringId = String(id);
  
</script>
<template>
  <div>
    <MapNetwork :graph_id="stringId"/>
  </div>
</template>
