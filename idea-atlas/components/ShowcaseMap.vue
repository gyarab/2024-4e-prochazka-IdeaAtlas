<script setup lang="ts">
import * as vNG from "v-network-graph";
import { reactive, ref, onMounted, onUnmounted, watch } from "vue";
import NodeInputDialog from './NodeInputDialog.vue';
import { keyboardShortcuts } from '../config/keyboardShortcuts';
import { mainConfig, GridConfig, ForceConfig } from "~/config/mapNetworkConfig";
import showcaseData from '../utils/showcaseData';
import {
  setShowingNodeInput,
  getShowingNodeInput,
  getShowingNodeEdit,
  setShowingNodeEdit,
  checkInputFieldShown
} from '../utils/uiTracker';
import {
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
  waveNodeSelect
} from "../utils/graphManager.js";
import { historyManager } from "../utils/graphHistory";
import { INITIAL_WAVE_SELECTION_DELAY, NETXT_WAVE_MODIFIER, MIN_WAVE_DELAY } from "~/config/constants";

// Makes copies of the showcase data
const data = reactive({
  nodes: { ...showcaseData.nodes },
  edges: { ...showcaseData.edges },
  layouts: { ...showcaseData.layouts },
});

const loading = ref(false);

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
    .filter(([_, node]) => node?.name?.toLowerCase().includes(newValue.toLowerCase()) ?? false)
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

const isWaveKeyHeld = ref(false);

const handleWaveKey = (event: KeyboardEvent) => {
    if (isSearchFocused.value) return;
    if (checkInputFieldShown()) return;
    if (event.code === keyboardShortcuts.wave.code) {
        if (keyboardShortcuts.wave.preventDefault) {
            event.preventDefault();
        }
        
        isWaveKeyHeld.value = true;
        let currentDelay = INITIAL_WAVE_SELECTION_DELAY
        
        const recursiveSelect = async () => {
            if (event.repeat || selectedNodes.value.length === 0 || !isWaveKeyHeld.value) return;
            
            const newNodes = await waveNodeSelect(data, selectedNodes.value, (newlySelected: string[]) => {
                selectedNodes.value = [...new Set([...selectedNodes.value, ...newlySelected])];
            });
            
            if (newNodes.length > 0 && isWaveKeyHeld.value) {
                currentDelay = Math.max(MIN_WAVE_DELAY, currentDelay * NETXT_WAVE_MODIFIER);
                setTimeout(recursiveSelect, currentDelay);
            }
        };
        
        recursiveSelect();
    }
};

const handleWaveKeyUp = (event: KeyboardEvent) => {
    if (event.code === keyboardShortcuts.wave.code) {
        isWaveKeyHeld.value = false;
    }
};

// Object to store current mouse coordinates
let mousePosition = { x: 0, y: 0 };

onMounted(async () => {
  if (configs.view) {
    configs.view.layoutHandler = GridConfig;
    configs.view.mouseWheelZoomEnabled = false;
  }

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
      setShowingNodeEdit(true);
    }
  };
  // HandleUndoKey: Undoes last action
  const handleUndoKey = (event: KeyboardEvent) => {
    if (isSearchFocused.value) return;
    if (checkInputFieldShown()) return;
    // returns when shift key is pressed
    // so it is not triggered on redo
    if (event.shiftKey) return;
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
  document.addEventListener('keydown', handleWaveKey);
  document.addEventListener('keyup', handleWaveKeyUp);

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
    document.removeEventListener('keydown', handleWaveKey);
    document.removeEventListener('keyup', handleWaveKeyUp);
  });

  historyManager.clearHistory();
  historyManager.addToHistory(data);
});

// Function which will calculate the position of first selected node
const calculateFirstSelectedNodePosition = () => {
  if (selectedNodes.value.length > 0 && graph.value) {
    const firstNodeId = selectedNodes.value[0];
    const nodeLayout = data.layouts.nodes[firstNodeId];
    const domPoint = graph.value.translateFromSvgToDomCoordinates({ x: nodeLayout.x, y: nodeLayout.y });
    
    // Get window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Dialog dimensions (approximate)
    const dialogHeight = 300; // height of the dialog
    const dialogWidth = 300;  // width of the dialog
    const padding = 100;       // minimum padding from screen edges
    
    // Calculate horizontal offset
    let xOffset = domPoint.x < windowWidth / 2 ? dialogWidth/2 + padding : -(dialogWidth/2 + padding);
    
    // Calculate vertical offset
    let yOffset = 0;
    if (domPoint.y < dialogHeight + padding) {
      // Too close to top - move down
      yOffset = (dialogHeight/2 + padding) - domPoint.y;
    } else if (domPoint.y > windowHeight - dialogHeight - padding) {
      // Too close to bottom - move up
      yOffset = (windowHeight - dialogHeight/2 - padding) - domPoint.y;
    }
    
    return {
      x: domPoint.x + xOffset,
      y: domPoint.y + yOffset
    };
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
// double click event handler
// show edit dialog for selected node
const eventHandlers: vNG.EventHandlers = {
  "node:dblclick": ({ node }) => {
    selectedNodes.value = [node];
    setShowingNodeEdit(true);
    setShowingNodeInput(false);
  },
  "node:click": ({ node }) => {
    selectedNodes.value = [node];
    setShowingNodeEdit(false);
    setShowingNodeInput(false);
  },
  "edge:click": ({}) => {
    setShowingNodeEdit(false);
    setShowingNodeInput(false);
  },
  "view:click": ({}) => {
    setShowingNodeEdit(false);
    setShowingNodeInput(false);
  },
  "view:dblclick": ({}) => {
    setShowingNodeEdit(false);
    newNodePosition.value = mousePosition;
    setShowingNodeInput(true);
    console.log("dblclick");
  },
  "node:dragend":({})=>{
    console.log("dragend");
    historyManager.addToHistory(data);
  },
}

// Configuration object for the graph
const configs = mainConfig;

// Add new ref for layout type
const isGridLayout = ref(true);

// Add handler for layout toggle
const handleLayoutToggle = () => {
  isGridLayout.value = !isGridLayout.value;
  // Prevents 'configs.view' is possibly 'undefined'. error
  //@ts-ignore
  configs.view.layoutHandler = isGridLayout.value ? GridConfig : ForceConfig;
  if (isGridLayout.value) {
    historyManager.addToHistory(data);
  }
};

import ControllsHint from './ControllsHint.vue';

// Add state for controls hint visibility
const showControls = ref(false);

// Add toggle function for controls
const toggleControls = () => {
  showControls.value = !showControls.value;
};
</script>

<template>
  <!-- Replace fixed positioning with relative positioning -->
  <div class="relative w-full h-full min-h-[500px]">
    <!-- Move controls to relative positioning -->
    <div class="absolute top-4 right-4 z-40">
      <button 
        @click="toggleControls"
        class="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        Controls
      </button>
    </div>

    <!-- Adjust toolbar positioning -->
    <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
      <input 
        type="text" 
        v-model="searchTerm"
        placeholder="Search nodes..."
        class="px-4 py-2 border rounded-md shadow-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @focus="handleSearchFocus"
        @blur="handleSearchBlur"
      />
      <button 
        @click="handleLayoutToggle"
        :class="{
          'px-4 py-2 text-white rounded-md shadow-md focus:outline-none focus:ring-2': true,
          'bg-teal-500 hover:bg-teal-600 focus:ring-teal-500': !isGridLayout,
          'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500': isGridLayout
        }"
      >
        {{ isGridLayout ? 'Force Layout' : 'Grid Layout'}}
      </button>
    </div>

    <ControllsHint 
      :is-open="showControls"
      @close="showControls = false"
    />

    <client-only>
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center">Loading...</div>
      <v-network-graph v-else 
        class="w-full h-full" 
        ref="graph" 
        v-model:selected-nodes="selectedNodes"
        v-model:selected-edges="selectedEdges" 
        :nodes="data.nodes" 
        :edges="data.edges" 
        :layouts="data.layouts" 
        :event-handlers="eventHandlers"
        :configs="configs" 
      />
    </client-only>

    <NodeInputDialog 
      :is-open="getShowingNodeInput()" 
      :position="newNodePosition" 
      @close="setShowingNodeInput(false)"
      @submit="handleNodeSubmit" 
    />

    <NodeEditDialog 
      :is-open="getShowingNodeEdit()" 
      :position="calculateFirstSelectedNodePosition()" 
      :current-name="getCurrentNodeName()"
      :current-color="getCurrentNodeColor()"
      :current-size="getCurrentNodeSize()"
      @close="setShowingNodeEdit(false)"
      @submit="handleNodeEdit" 
    />
  </div>
</template>

<style>
.loading-indicator {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #555;
}
</style>