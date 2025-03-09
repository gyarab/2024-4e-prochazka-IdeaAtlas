<script setup lang="ts">
import * as vNG from "v-network-graph";
import { reactive, ref, onMounted, onUnmounted, watch } from "vue"; // Add watch
import service from "../utils/graphService";
import NodeInputDialog from './NodeInputDialog.vue';
import { keyboardShortcuts } from '../config/keyboardShortcuts';
import { mainConfig } from "~/config/mapNetworkConfig";
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
  moveBackward,
  adjustNodeLayouts
} from "../utils/graphManager.js";

// Id of Graph to be fetched and displayed
const props = defineProps<{
    graph_id: string;
    
}>();

const supabase = useSupabaseClient();

const data = reactive({
  nodes: {} as Record<string, { name: string; color: string; size: number }>,
  edges: {} as Record<string, { source: string; target: string; color: string; }>,
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

// Add new search term ref
const searchTerm = ref('');

// Add ref for search focus state
const isSearchFocused = ref(false);

// Add handlers for search focus
const handleSearchFocus = () => {
  isSearchFocused.value = true;
};
// Add handlers for search blur
const handleSearchBlur = () => {
  isSearchFocused.value = false;
};

// Add watch effect for searchTerm
watch(searchTerm, (newValue) => {
  if (!newValue) {
    emptySelected(selectedNodes, selectedEdges);
    return;
  }
  
  const matchingNodes = Object.entries(data.nodes)
    .filter(([_, node]) => node.name.toLowerCase().includes(newValue.toLowerCase()))
    .map(([id, _]) => id);
  
  selectedNodes.value = matchingNodes;
});


// Function to get current node name
const getCurrentNodeName = () => {
  if (selectedNodes.value.length > 0) {
    const firstNodeId = selectedNodes.value[0];
    return data.nodes[firstNodeId]?.name || '';
  }
  return '';
};

// Function to get current node color
const getCurrentNodeColor = () => {
  if (selectedNodes.value.length > 0) {
    const firstNodeId = selectedNodes.value[0];
    return data.nodes[firstNodeId]?.color || '';
  }
  return '';
};

// Function to get current node size
// Hartcoded default size to 20
const getCurrentNodeSize = () => {
  if (selectedNodes.value.length > 0) {
    const firstNodeId = selectedNodes.value[0];
    return data.nodes[firstNodeId]?.size || 20;
  }
  return 20;
};

// Add save handler function
const handleSave = async () => {
  try {
    await service.saveGraph(supabase, data, props.graph_id);
  } catch (error) {
    console.error('Error saving graph:', error);
  }
};

// Add handler for auto-layout
const handleAutoLayout = () => {
  adjustNodeLayouts(data);
};

onMounted(async () => {

  // Object to store current mouse coordinates
  let mousePosition = { x: 0, y: 0 };

  // Create named handler functions that can be referenced for removal
  const handleMouseMove = (event: MouseEvent) => {
    mousePosition = { x: event.offsetX, y: event.offsetY };
  };

  //handleDeselectKey: Deselects all currently selected nodes and edges when deselect key is pressed
  const handleDeselectKey = (event: KeyboardEvent) => {
    if (isSearchFocused.value) return;
    if (event.code === keyboardShortcuts.deselect.code) {
      emptySelected(selectedNodes, selectedEdges);
    }
  };
  //handleAddNodeKey: Creates a new node at current mouse position when add node key is pressed
  const handleAddNodeKey = (event: KeyboardEvent) => {
    if (isSearchFocused.value) return;
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
    if (isSearchFocused.value) return;
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
    if (isSearchFocused.value) return;
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
    if (isSearchFocused.value) return;
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
    if (isSearchFocused.value) return;
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
    if (isSearchFocused.value) return;
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
    if (isSearchFocused.value) return;
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
    if (isSearchFocused.value) return;
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
const handleNodeSubmit = (nodeProps: { name: string, color: string, size: number }) => {
  const svgPoint = graph.value?.translateFromDomToSvgCoordinates(newNodePosition.value);
  if (svgPoint) {
    addNewNode(data, nodeProps, svgPoint.x, svgPoint.y);
  }
  setShowingNodeInput(false);
};

const handleNodeEdit = (changes: { name: string, color: string, size: number }) => {
  const svgPoint = graph.value?.translateFromDomToSvgCoordinates(newNodePosition.value);
  if (svgPoint) {
    editNodes(data, selectedNodes.value, changes);
  }
  setShowingNodeEdit(false);
};


// Configuration object for the graph
const configs = mainConfig;
</script>

<template>
  <!-- <div>
    <button @click="service.upsertGraphData(supabase, data)">Upsert whole graph</button>
  </div>
  <div>
    <button @click="console.log(data)">console log data</button>
  </div> -->
  <!-- Simplified search input - increase z-index -->
  <div class="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
    <input 
      type="text" 
      v-model="searchTerm"
      placeholder="Search nodes..."
      class="px-4 py-2 border rounded-md shadow-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      @focus="handleSearchFocus"
      @blur="handleSearchBlur"
    />
    <button 
      @click="handleSave"
      class="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Save
    </button>
    <button 
      @click="handleAutoLayout"
      class="px-4 py-2 bg-purple-500 text-white rounded-md shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      Auto Layout
    </button>
  </div>
  <client-only>
    <div v-if="loading" class="loading-indicator">Loading...</div>
    <!-- Adjust map position -->
    <v-network-graph v-else class="fixed inset-0 w-screen h-screen z-0" ref="graph" v-model:selected-nodes="selectedNodes"
      v-model:selected-edges="selectedEdges" :nodes="data.nodes" :edges="data.edges" :layouts="data.layouts"
      :configs="configs" />
  </client-only>
  <!-- Node input dialog component for creating new nodes -->
  <!-- Shows when showNodeInput is true, positioned at newNodePosition -->
  <!-- Emits 'close' event to hide dialog and 'submit' event with node name -->
  <NodeInputDialog :is-open="getShowingNodeInput()" :position="newNodePosition" @close="setShowingNodeInput(false)"
    @submit="handleNodeSubmit" />
  <!-- TODO find a position of first selected node -->
  <NodeEditDialog 
    :is-open="getShowingNodeEdit()" 
    :position="calculateFirstSelectedNodePosition()" 
    :current-name="getCurrentNodeName()"
    :current-color="getCurrentNodeColor()"
    :current-size="getCurrentNodeSize()"
    @close="setShowingNodeEdit(false)"
    @submit="handleNodeEdit" 
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