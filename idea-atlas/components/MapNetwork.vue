<script setup lang="ts">
import * as vNG from "v-network-graph";
import { reactive, ref, onMounted, onUnmounted } from "vue"; // Added onUnmounted
import service from "../utils/graphService";
import manager from "../utils/graphManager";
import NodeInputDialog from './NodeInputDialog.vue';

const test_name = "test database new node "
const supabase = useSupabaseClient();

const data = reactive({
  nodes: {} as Record<string, { name: string }>,
  edges: {} as Record<string, { source: string; target: string }>,
  layouts: { nodes: {} } as { nodes: Record<string, { x: number; y: number }> },
});
const loading = ref(true);

const graph = ref<vNG.Instance>()
const showNodeInput = ref(false);
const newNodePosition = ref({ x: 0, y: 0 });

onMounted(async () => {
  
  
  let mousePosition = { x: 0, y: 0 };

  // Track mouse position on mousemove
  document.addEventListener('mousemove', (event) => {
    mousePosition = { x: event.offsetX, y: event.offsetY };
  });

  // Listen for keydown event
  document.addEventListener('keydown', (event) => {
    if (event.key === 'q' || event.key === 'Q') {
      console.log("Q key pressed");
      // check if graph exists
      if (!graph.value) return;
      // Use the current mouse position
      newNodePosition.value = mousePosition;
      showNodeInput.value = true;
    }
  });

  //TODO
  //Fetches grpah data from the database
  try {
    const fetchedData = await service.fetchGraph(supabase, "8bedcacd-0049-4f32-a1e5-4fe72a2080d2");
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
});

// Add handler for node name submission
const handleNodeNameSubmit = (name: string) => {
  const svgPoint = graph.value?.translateFromDomToSvgCoordinates(newNodePosition.value);
  if (svgPoint) {
    manager.addNewNode(data, name, svgPoint.x, svgPoint.y);
  }
  showNodeInput.value = false;
};

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
    <v-network-graph v-else class="fixed inset-0 w-screen h-screen"
    ref="graph" 
    :nodes="data.nodes" qq
    :edges="data.edges"
    :layouts="data.layouts"
    :configs="configs"/>
  </client-only>
  <NodeInputDialog
    :is-open="showNodeInput"
    :position="newNodePosition"
    @close="showNodeInput = false"
    @submit="handleNodeNameSubmit"
  />
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