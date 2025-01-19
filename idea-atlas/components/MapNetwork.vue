<script setup lang="ts">
import * as vNG from "v-network-graph";
import { reactive, ref, onMounted, onUnmounted } from "vue"; // Added onUnmounted
import service from "../utils/graphService";
import NodeInputDialog from './NodeInputDialog.vue';
import { keyboardShortcuts } from '../config/keyboardShortcuts';
import {
  setShowingNodeInput,
  getShowingNodeInput,
  getShowingNodeEdit,
  setShowingNodeEdit,
  checkInputFieldShown
} from '../utils/uiTracker';
import {
  initilizeHistory,
  addNewNode,
  deleteNodes,
  addEgesOneSource,
  editNodes,
  deleteEdges,
  addEdges,
  emptySelected,
  deleeteEdgesBasedOnNodes,
  moveForward,
  moveBackward
} from "../utils/graphManager";

const props = defineProps<{
    graph_id: string;
}>();

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

  // Create named handler functions that can be referenced for removal
  const handleMouseMove = (event: MouseEvent) => {
    mousePosition = { x: event.offsetX, y: event.offsetY };
  };

  //handleDeselectKey: Deselects all currently selected nodes and edges when deselect key is pressed
  const handleDeselectKey = (event: KeyboardEvent) => {
    if (event.code === keyboardShortcuts.deselect.code) {
      emptySelected(selectedNodes, selectedEdges);
    }
  };
  //handleAddNodeKey: Creates a new node at current mouse position when add node key is pressed
  const handleAddNodeKey = (event: KeyboardEvent) => {
    if (checkInputFieldShown()) return;
    if (event.ctrlKey) return;
    if (event.code === keyboardShortcuts.addNode.code) {
      if (!graph.value) return;
      newNodePosition.value = mousePosition;
      setShowingNodeInput(true);
      if (keyboardShortcuts.addNode.preventDefault) {
        event.preventDefault();
      }
    }
  };
  // HandleAddEdgeOneSourceKey: Creates edges from first selected node to all other selected nodes
  const handleAddEdgeOneSourceKey = (event: KeyboardEvent) => {
    if (checkInputFieldShown()) return;
    if (event.ctrlKey) return;
    if (event.code === keyboardShortcuts.addEdgeOneSource.code && selectedNodes.value.length >= 2) {
      if (keyboardShortcuts.addEdgeOneSource.preventDefault) {
        event.preventDefault();
      }
      addEgesOneSource(data, selectedNodes.value);
    }
  };
  // handleAddEdgeKey: Creates edges between all selected nodes when Ctrl + add edge key is pressed
  const handleAddEdgeKey = (event: KeyboardEvent) => {
    if (checkInputFieldShown()) return;
    if (event.code === keyboardShortcuts.addEdgeOneSource.code && event.ctrlKey && selectedNodes.value.length >= 2) {
      if (keyboardShortcuts.addEdgeOneSource.preventDefault) {
        event.preventDefault();
      }
      addEdges(data, selectedNodes.value);
    }
  };
  // HandleDeleteSelectedKey: Deletes all selected nodes and edges
  const handleDeleteSelectedKey = (event: KeyboardEvent) => {
    if (checkInputFieldShown()) return;
    if (event.ctrlKey) return;
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
  };
  // HandleDeleteEdgesFromSelectedNodesKey: Deletes all edges between selected nodes
  const handleDeleteEdgesFromSelectedNodesKey = (event: KeyboardEvent) => {
    if (checkInputFieldShown()) return;
    if (event.code === keyboardShortcuts.deleteEdgesFromSelectedNodes.code && event.ctrlKey) {
      if (keyboardShortcuts.deleteSelected.preventDefault) {
        event.preventDefault();
      }
      if (selectedNodes.value.length > 0) {
        deleeteEdgesBasedOnNodes(data, selectedNodes.value);
      }
    }
  };
  // HandleEditNodeKey: Opens node edit dialog for selected node
  const handleEditNodeKey = (event: KeyboardEvent) => {
    if (checkInputFieldShown()) return;
    if (event.code === keyboardShortcuts.editNode.code && event.ctrlKey && selectedNodes.value.length > 0) {
      if (keyboardShortcuts.editNode.preventDefault) {
        event.preventDefault();
      }
      showNodeEdit.value = true;
    }
  };
  // HandleUndoKey: Undoes last action
  const handleUndoKey = (event: KeyboardEvent) => {
    if (checkInputFieldShown()) return;
    if (event.code === keyboardShortcuts.undo.code && event.ctrlKey) {
      if (keyboardShortcuts.undo.preventDefault) {
        event.preventDefault();
      }
      moveBackward(data);
      console.log("undo");
    }
  };
  // HandleRedoKey: Redoes last undone action
  const handleRedoKey = (event: KeyboardEvent) => {
    if (checkInputFieldShown()) return;
    if (event.code === keyboardShortcuts.redo.code && event.ctrlKey && event.shiftKey) {
      if (keyboardShortcuts.redo.preventDefault) {
        event.preventDefault();
      }
      console.log("redo");
      moveForward(data);
    }
  };

  // Add event listeners with named handlers
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('keydown', handleDeselectKey);
  document.addEventListener('keydown', handleAddNodeKey);
  document.addEventListener('keydown', handleAddEdgeOneSourceKey);
  document.addEventListener('keydown', handleAddEdgeKey);
  document.addEventListener('keydown', handleDeleteSelectedKey);
  document.addEventListener('keydown', handleDeleteEdgesFromSelectedNodesKey);
  document.addEventListener('keydown', handleEditNodeKey);
  document.addEventListener('keydown', handleUndoKey);
  document.addEventListener('keydown', handleRedoKey);

  // Remove event listeners when component is unmounted
  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('keydown', handleDeselectKey);
    document.removeEventListener('keydown', handleAddNodeKey);
    document.removeEventListener('keydown', handleAddEdgeOneSourceKey);
    document.removeEventListener('keydown', handleAddEdgeKey);
    document.removeEventListener('keydown', handleDeleteSelectedKey);
    document.removeEventListener('keydown', handleDeleteEdgesFromSelectedNodesKey);
    document.removeEventListener('keydown', handleEditNodeKey);
    document.removeEventListener('keydown', handleUndoKey);
    document.removeEventListener('keydown', handleRedoKey);
  });


  //Fetches grpah data from the database
  try {
    const fetchedData = await service.fetchGraph(supabase, props.graph_id);
    if (fetchedData) {
      data.nodes = fetchedData.nodes || [];
      data.edges = fetchedData.edges || [];
      data.layouts = fetchedData.layouts || [];

      // Initialize history for undo/redo functionality
      initilizeHistory(data);
    } else {
      console.warn("No data returned from fetchGraph");
    }
  } catch (error) {
    console.error("Error fetching graph data:", error);
  } finally {
    loading.value = false;
  }
});

// Function which will calculate the position of first selected node
const calculateFirstSelectedNodePosition = () => {
  if (selectedNodes.value.length > 0 && graph.value) {
    const firstNodeId = selectedNodes.value[0];
    const nodeLayout = data.layouts.nodes[firstNodeId];
    const domPoint = graph.value.translateFromSvgToDomCoordinates({ x: nodeLayout.x, y: nodeLayout.y });
    return domPoint;

  }
  return { x: 0, y: 0 };
};

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
    <button @click="console.log(data)">console log data</button>
  </div>
  <client-only>
    <div v-if="loading" class="loading-indicator">Loading...</div>
    <!-- v-model creates 2 way binding -->
    <v-network-graph v-else class="fixed inset-0 w-screen h-screen" ref="graph" v-model:selected-nodes="selectedNodes"
      v-model:selected-edges="selectedEdges" :nodes="data.nodes" :edges="data.edges" :layouts="data.layouts"
      :configs="configs" />
  </client-only>
  <!-- Node input dialog component for creating new nodes -->
  <!-- Shows when showNodeInput is true, positioned at newNodePosition -->
  <!-- Emits 'close' event to hide dialog and 'submit' event with node name -->
  <NodeInputDialog :is-open="getShowingNodeInput()" :position="newNodePosition" @close="setShowingNodeInput(false)"
    @submit="handleNodeNameSubmit" />
  <!-- TODO find a position of first selected node -->
  <NodeEditDialog :is-open="getShowingNodeEdit()" :position="calculateFirstSelectedNodePosition()" @close="setShowingNodeEdit(false)"
    @submit="handleNodeNameEdit" />
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