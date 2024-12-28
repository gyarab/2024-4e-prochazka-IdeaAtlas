<script setup lang="ts">
import * as vNG from "v-network-graph";
import { reactive, ref, onMounted } from "vue";
import service from "../utils/graphService";

const supabase = useSupabaseClient();

// Reactive state for graph data
const data = reactive({
  nodes: {} as Record<string, { name: string }>, // Using your Nodes structure
  edges: {} as Record<string, { source: string; target: string }>, // Using your Edges structure
  layouts: { nodes: {} } as { nodes: Record<string, { x: number; y: number }> }, // Using your Layouts structure
});

const loading = ref(true); // Loading state


onMounted(async () => {
  try {
    const fetchedData = await service.fetchGraph(supabase);

    if (fetchedData) {
      data.nodes = fetchedData.nodes || [];
      data.edges = fetchedData.edges || [];
      data.layouts = fetchedData.layouts || [];
    } else {
      console.warn("No data returned from fetchGraph");
    }
  } catch (error) {
    console.error("Error fetching graph data:", error);
  } finally {
    loading.value = false; // Set loading to false after data fetch
  }
});

// Define the configurations
const configs = reactive(
  vNG.defineConfigs({
    view: {
      grid: {
        visible: true,
        interval: 10,
        thickIncrements: 5,
        line: {
          color: "#e0e0e0",
          width: 1,
          dasharray: 1,
        },
        thick: {
          color: "#cccccc",
          width: 1,
          dasharray: 0,
        },
      },
      layoutHandler: new vNG.GridLayout({ grid: 10 }),
      scalingObjects: true, // Enable scaling objects, so the nodes and edges will be scaled when zooming
      minZoomLevel: 0.1,
      maxZoomLevel: 16,
    },
  })
);
</script>

<template>
  <client-only>
    <div v-if="loading" class="loading-indicator">Loading...</div>
    <v-network-graph
      v-else
      class="fixed inset-0 w-screen h-screen"
      :nodes="data.nodes"
      :edges="data.edges"
      :layouts="data.layouts"
      :configs="configs"
    />
  </client-only>
</template>

<style>
.loading-indicator {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #555;
}
</style>
