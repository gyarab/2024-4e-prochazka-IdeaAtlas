<script setup lang="ts">
import * as vNG from "v-network-graph";
import { reactive, ref, onMounted, onUnmounted } from "vue"; // Added onUnmounted
import service from "../utils/graphService";
import manager from "../utils/graphManager";


const test_name = "test database new node "
const supabase = useSupabaseClient();

const data = reactive({
  nodes: {} as Record<string, { name: string }>,
  edges: {} as Record<string, { source: string; target: string }>,
  layouts: { nodes: {} } as { nodes: Record<string, { x: number; y: number }> },
});
const loading = ref(true);

const graph = ref<vNG.Instance>()

const eventHandlers: vNG.EventHandlers = {
  "view:click": ({ event }) => {
    console.log("left click 1")
    if (!graph.value) return
    console.log("left click 2")
    const point = { x: event.offsetX, y: event.offsetY }
    // translate coordinates: DOM -> SVG
    const svgPoint = graph.value.translateFromDomToSvgCoordinates(point)

    // add node and its position
    manager.addNewNode(data, test_name, svgPoint.x, svgPoint.y);
  },
}
// Handler function for keypress
const handleKeyPress = (event: KeyboardEvent) => {
  // === values and types are equal
  if (event.key === 'q') {
    // TODO hard coded axis values
    manager.addNewNode(data, test_name, 0, 0);
  }
};

onMounted(async () => {
  try {
    const fetchedData = await service.fetchGraph(supabase,"8bedcacd-0049-4f32-a1e5-4fe72a2080d2");
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
    loading.value = false;
  }

  // Add the event listener when component is mounted
  window.addEventListener('keypress', handleKeyPress);
});

// Remove the event listener when component is unmounted
onUnmounted(() => {
  window.removeEventListener('keypress', handleKeyPress);
});

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
      scalingObjects: true,
      minZoomLevel: 0.1,
      maxZoomLevel: 16,
    },
  })
);
</script>

<template>
  <div>
    <button @click="manager.addNewNode(data, test_name)">add new node</button>
  </div>
  <div>
    <button @click="service.upsertGraphData(supabase, data)">Upsert whole graph</button>
  </div>
  <div>
    <button @click="console.log(data)">console log data</button>
  </div>
  <client-only>
    <div v-if="loading" class="loading-indicator">Loading...</div>
    <v-network-graph
      v-else
      class="fixed inset-0 w-screen h-screen"
      ref="graph"
      :nodes="data.nodes"
      :edges="data.edges"
      :layouts="data.layouts"
      :configs="configs"
      :event-handlers="eventHandlers"
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