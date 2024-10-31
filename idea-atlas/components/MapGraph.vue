<template>
  <div ref="networkContainer" id="mynetwork" style="width: 600px; height: 400px; border: 1px solid lightgray;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const networkContainer = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/vis-network/standalone/umd/vis-network.min.js';
  script.onload = () => {
    if (networkContainer.value) {
      // @ts-ignore
      const nodes = new vis.DataSet([
        { id: 1, label: 'Node 1' },
        { id: 2, label: 'Node 2' },
        { id: 3, label: 'Node 3' },
        { id: 4, label: 'Node 4' },
        { id: 5, label: 'Node 5' }
      ]);

      // @ts-ignore
      const edges = new vis.DataSet([
        { from: 1, to: 3 },
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
        { from: 3, to: 3 }
      ]);

      const data = {
        nodes: nodes,
        edges: edges
      };

      const options = {};

      // @ts-ignore
      new vis.Network(networkContainer.value, data, options);
    }
  };
  document.head.appendChild(script);
});
</script>

<style scoped>
#mynetwork {
  width: 600px;
  height: 400px;
  border: 1px solid lightgray;
}
</style>