
<script setup lang="ts">
    
import * as vNG from "v-network-graph"
interface Node {
    name: string;
    }

interface Edge {
    source: string;
    target: string;
  }

const nodes: Record<string, Node> = {};
const edges: Record<string, Edge> = {};

// Generate 50 nodes
for (let i = 1; i <= 50; i++) {
    nodes[`node${i}`] = { name: `Node ${i}` };
    }

  // Generate 75 edges
  for (let i = 1; i <= 75; i++) {
    const source = `node${Math.ceil(Math.random() * 50)}`;
    const target = `node${Math.ceil(Math.random() * 50)}`;
    edges[`edge${i}`] = { source, target };
  }
  // Define the configurations
const configs = reactive(
    vNG.defineConfigs({
        view: {
            scalingObjects: true, // Enable scaling objects, so the nodes and edges will be scaled when zooming
            minZoomLevel: 0.1,
            maxZoomLevel: 16,
    },
  })
)
</script>

<template>
    <div>
    <v-network-graph
    class="graph"
    
    :nodes= "nodes"
    
    :edges= "edges"
    :configs = "configs" />
    </div>
</template>

<style>
.graph {
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
}
</style>