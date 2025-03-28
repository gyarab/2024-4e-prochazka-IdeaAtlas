<script setup lang="ts">
  import MapNetwork from '~/components/MapNetwork.vue';

  definePageMeta({
    middleware: ["auth"],
});

  const { id } = useRoute().params;
  const stringId = String(id);
  
</script>
<template>
  <div>
    <ClientOnly>
      <MapNetwork :graph_id="stringId"/>
    </ClientOnly>
  </div>
</template>
