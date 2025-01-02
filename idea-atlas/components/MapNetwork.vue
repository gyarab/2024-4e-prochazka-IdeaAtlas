<script setup lang="ts">
import * as vNG from "v-network-graph";
import { reactive, ref, onMounted, onUnmounted } from "vue"; // Added onUnmounted
import service from "../utils/graphService";
import manager from "../utils/graphManager";
import NodeInputDialog from './NodeInputDialog.vue';
import { keyboardShortcuts } from '../config/keyboardShortcuts';

const supabase = useSupabaseClient();

const data = reactive({
  nodes: {} as Record<string, { name: string }>,
  edges: {} as Record<string, { source: string; target: string }>,
  layouts: { nodes: {} } as { nodes: Record<string, { x: number; y: number }> },
});


const loading = ref(true);

// Reference to the graph instance
const graph = ref<vNG.Instance>();

// State to store IDs of selected nodes
const selectedNodes = ref<string[]>([])
// State to control the visibility of the node input dialog
const showNodeInput = ref(false);
const showNodeEdit = ref(false);
// Position where the new node will be added
const newNodePosition = ref({ x: 0, y: 0 });

onMounted(async () => {
  // Object to store current mouse coordinates
  let mousePosition = { x: 0, y: 0 };

  // Event listener to track mouse position in real-time
  // Updates mousePosition whenever the mouse moves
  document.addEventListener('mousemove', (event) => {
    mousePosition = { x: event.offsetX, y: event.offsetY };
  });
  
  
  // Event listener for Enter key to create new nodes
  document.addEventListener('keydown', (event) => {
    // Return if the node input dialog is already open
    // Prevents creating a new node while the dialog is open
    if (showNodeInput.value) return;
    if (showNodeEdit.value) return;
    
    if (event.code === keyboardShortcuts.addNode.key) {
      // Validate that graph component is initialized
      if (!graph.value) return;
      // Set the position for the new node based on current mouse location
      newNodePosition.value = mousePosition;
      // Show the node input dialog
      showNodeInput.value = true;
      // Prevent default space behavior (like scrolling)
      if (keyboardShortcuts.addNode.preventDefault) {
        event.preventDefault();
      }
    }
  });

  // Event listener for Space key to create edges between selected nodes
  document.addEventListener('keydown', (event) => {
    // Return if the node input dialog is already open
    // Prevents creating a new node while the dialog is open
    if (showNodeInput.value) return;
    if (showNodeEdit.value) return;
    if (event.code === keyboardShortcuts.addEdge.key && selectedNodes.value.length >= 2) {
      if (keyboardShortcuts.addEdge.preventDefault) {
        event.preventDefault();
      }
      manager.addEdges(data, selectedNodes.value);
    }
  });
  // Event listener for backspace to delete selected nodes
  document.addEventListener('keydown', (event) => {
    // Return if the node input dialog is already open
    // Prevents creating a new node while the dialog is open
    // ?
    // Maybe this if statement should be further in the code - after the check for the key
    if (showNodeInput.value) return;
    if (showNodeEdit.value) return;
    if (event.key === keyboardShortcuts.deleteNode.key && selectedNodes.value.length > 0) {
      if (keyboardShortcuts.deleteNode.preventDefault) {
        event.preventDefault();
      }
      manager.deleteNodes(data, selectedNodes.value);
    }
  });
  // Event listener for TODO key to edit selected nodes
  document.addEventListener('keydown', (event) => {
    // Return if the node input dialog is already open
    // Prevents creating a new node while the dialog is open
    if (showNodeInput.value) return;
    if (showNodeEdit.value) return;
    // Check if the edit node shortcut is pressed and at least one node is selected
    if (event.key === keyboardShortcuts.editNode.key && selectedNodes.value.length > 0) {
      // Prevent default behavior of the key press
      if (keyboardShortcuts.editNode.preventDefault) {
        event.preventDefault();
      }
      // Show the node edit dialog
      showNodeEdit.value = true;
    }
  });
//TODO add all event listeners
// Remove event listeners when component is unmounted
onUnmounted(() => {
  document.removeEventListener('mousemove', (event) => {});
  document.removeEventListener('keydown', (event) => {});
  document.removeEventListener('keydown', (event) => {});
});
  //TOdo fetch the correct graph by id
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

// Handler for node name submission
const handleNodeNameSubmit = (name: string) => {
  const svgPoint = graph.value?.translateFromDomToSvgCoordinates(newNodePosition.value);
  if (svgPoint) {
    manager.addNewNode(data, name, svgPoint.x, svgPoint.y);
  }
  showNodeInput.value = false;
};
const handleNodeNameEdit = (newName: string) => {
  // TODO this might not have to be here
  const svgPoint = graph.value?.translateFromDomToSvgCoordinates(newNodePosition.value);
  if (svgPoint) {
    manager.editNodes(data, selectedNodes.value, newName);
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
    node: {
      selectable: true,
    }
  })
);
</script>

<template>
  <div>
    <button @click="service.upsertGraphData(supabase, data)">Upsert whole graph</button>
  </div>
  <div>
    <button @click="console.log(selectedNodes)">console log data</button>
  </div>
  <client-only>
    <div v-if="loading" class="loading-indicator">Loading...</div>
    <!-- v-model creates 2 way binding -->
    <v-network-graph v-else class="fixed inset-0 w-screen h-screen"
    ref="graph"
    v-model:selected-nodes="selectedNodes"
    :nodes="data.nodes"
    :edges="data.edges"
    :layouts="data.layouts"
    :configs="configs"
    />
  </client-only>
  <!-- Node input dialog component for creating new nodes -->
  <!-- Shows when showNodeInput is true, positioned at newNodePosition -->
  <!-- Emits 'close' event to hide dialog and 'submit' event with node name -->
  <NodeInputDialog
    :is-open="showNodeInput"
    :position="newNodePosition"
    @close="showNodeInput = false"
    @submit="handleNodeNameSubmit"
  />
  <!-- TODO find a position of first selected node -->
  <NodeEditDialog
    :is-open="showNodeEdit"
    
    :position="{ x: 500, y: 500 }"
    @close="showNodeEdit = false"
    @submit="handleNodeNameEdit"
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