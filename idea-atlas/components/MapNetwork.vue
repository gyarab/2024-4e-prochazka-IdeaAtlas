<script setup lang="ts">
import * as vNG from "v-network-graph";
import { reactive, ref, onMounted, onUnmounted } from "vue"; // Added onUnmounted
import service from "../utils/graphService";
import { addNewNode, deleteNodes,addEgesOneSource, editNodes, deleteEdges,addEdges, emptySelected } from "../utils/graphManager";
import NodeInputDialog from './NodeInputDialog.vue';
import { keyboardShortcuts } from '../config/keyboardShortcuts';
import {
    setShowingNodeInput,
    getShowingNodeInput,
    getShowingNodeEdit,
    setShowingNodeEdit,
    checkInputFieldShown
} from '../utils/uiTracker';


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
// State to store IDs of selected edges
const selectedEdges = ref<string[]>([])

// State to control the visibility of the node input dialog
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
  
  // Event listener for Esc key to deselect all nodes and edges
  document.addEventListener('keydown', (event) => {
    if (event.code === keyboardShortcuts.deselect.code) {
      emptySelected(selectedNodes, selectedEdges);
    }
  });
  // Event listener for Enter key to create new nodes
  document.addEventListener('keydown', (event) => {
    // Return if the node input dialog is already open
    // Prevents creating a new node while the dialog is open
    if (checkInputFieldShown()) return;
    // Prevent creating a new node if the Ctrl key is pressed
    // Ctrl + Enter is used for editing nodes
    if (event.ctrlKey)return;
    if (event.code === keyboardShortcuts.addNode.code) {
      // Validate that graph component is initialized
      if (!graph.value) return;
      // Set the position for the new node based on current mouse location
      newNodePosition.value = mousePosition;
      // Show the node input dialog
      setShowingNodeInput(true);
      // Prevent default space behavior (like scrolling)
      if (keyboardShortcuts.addNode.preventDefault) {
        event.preventDefault();
      }
    }
  });

  // Event listener for Space key to create edges between selected nodes - one source
  document.addEventListener('keydown', (event) => {
    // Return if the node input dialog is already open
    if (checkInputFieldShown()) return;
    if (event.ctrlKey) return;
    if (event.code === keyboardShortcuts.addEdgeOneSource.code && selectedNodes.value.length >= 2) {
      if (keyboardShortcuts.addEdgeOneSource.preventDefault) {
        event.preventDefault();
      }
      addEgesOneSource(data, selectedNodes.value);
    }
  });
    // Event listener for Space + Ctrl key to create edges between selected nodes
    document.addEventListener('keydown', (event) => {
    // Return if the node input dialog is already open
    if (checkInputFieldShown()) return;
    // Check if the add edge shortcut + Ctrl is pressed and at least two nodes are selected
    if (event.code === keyboardShortcuts.addEdgeOneSource.code && event.ctrlKey && selectedNodes.value.length >= 2) {
      if (keyboardShortcuts.addEdgeOneSource.preventDefault) {
        event.preventDefault();
      }
      addEdges(data, selectedNodes.value);
    }
  });
  // Event listener for backspace to delete selected nodes or edges
  document.addEventListener('keydown', (event) => {
    // Return if the node input dialog is already open
    if (checkInputFieldShown()) return;
    if (event.code === keyboardShortcuts.deleteSelected.code) {
      if (keyboardShortcuts.deleteSelected.preventDefault) {
        event.preventDefault();
      }
      if (selectedEdges.value.length > 0) {
          deleteEdges(data, selectedEdges.value);
        }
      if (selectedNodes.value.length > 0) {
        deleteNodes(data, selectedNodes.value);
      }
      }
  });
  // Event listener for CTRL + Enter key to edit selected nodes
  document.addEventListener('keydown', (event) => {
    // Return if the node input dialog is already open
    if (checkInputFieldShown()) return;
    // Check if the edit node shortcut is pressed and at least one node is selected
    if (event.code === keyboardShortcuts.editNode.code && event.ctrlKey && selectedNodes.value.length > 0) {
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
  //TODO fetch the correct graph by id
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
    addNewNode(data, name, svgPoint.x, svgPoint.y);
  }
  setShowingNodeInput(false);
};
const handleNodeNameEdit = (newName: string) => {
  // TODO this might not have to be here
  const svgPoint = graph.value?.translateFromDomToSvgCoordinates(newNodePosition.value);
  if (svgPoint) {
    editNodes(data, selectedNodes.value, newName);
  }
  setShowingNodeEdit(false);
};

const configs = reactive(
  vNG.defineConfigs({
    view: {
      boxSelectionEnabled: true,
      selection: {
        box: {
          color: "#0000ff20",
          strokeWidth: 1,
          strokeColor: "#aaaaff",
          strokeDasharray: "0",
        },
      },
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
    },
    edge: {
      selectable: true,
    },
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
    v-model:selected-edges="selectedEdges"
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
    :is-open="getShowingNodeInput()"
    :position="newNodePosition"
    @close="setShowingNodeInput(false)"
    @submit="handleNodeNameSubmit"
  />
  <!-- TODO find a position of first selected node -->
  <NodeEditDialog
    :is-open="getShowingNodeEdit()"
    
    :position="{ x: 500, y: 500 }"
    @close="setShowingNodeEdit(false)"
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