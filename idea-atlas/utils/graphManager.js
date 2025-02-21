// This file contains the functions that are used to manage the graph data structure
import { historyManager } from "./graphHistory";


function initilizeHistory(data) {
    historyManager.addToHistory(data);
}
// adds a new node to the graph
function addNewNode(data, nodeProps, xMousePos, yMousePos) {
    // Find the largest numeric part of the existing keys
    const maxNodeId = findCurrentMaxNodeId(data);
    // Generate the next key
    const nextNodeId = `node${maxNodeId + 1}`;
    
    // Add the new node with all properties
    data.nodes[nextNodeId] = {
        name: nodeProps.name,
        color: nodeProps.color,
        size: nodeProps.size
    };
    // Adds the new node to the layouts so its position is tracked
    data.layouts.nodes[nextNodeId] = { x: xMousePos, y: yMousePos };
    
    historyManager.addToHistory(data);
    
}
//Deletes multiple nodes from the graph
function deleteNodes(data, nodesToDelete) {
    
    const nodes = data.nodes;
    // Nodes which will remain after deletion 
    const remainingNodes = {};
    
    // Spares only the nodes which are not contained in the nodesToDelete array
    for (const [key, value] of Object.entries(nodes)) {
        if (!nodesToDelete.includes(key)) {
            remainingNodes[key] = value;
        }
    }
    
    // Updates the nodes object
    data.nodes = remainingNodes;
    
    // Removes the edges which contain any of the nodes to be deleted
    const edges = data.edges;
    const remainingEdges = {};
    for (const [key, edge] of Object.entries(edges)) {
        // Check for the source and target nodes in the nodesToDelete array
        if (!nodesToDelete.includes(edge.source) && !nodesToDelete.includes(edge.target)) {
            remainingEdges[key] = edge;
        }
    }
    data.edges = remainingEdges;
    
    // Clean up layouts
    for (const nodeId of nodesToDelete) {
        delete data.layouts.nodes[nodeId];
    }
    historyManager.addToHistory(data);
}
// Function which will add to edges:
// With source as the first node in the array
// And target as all the other nodes in the array
function addEgesOneSource(data, selectedNodes) {
    // Return if selected nodes are less than 2 - cannot create an edge
    if (selectedNodes.length < 2) return;
    
    const source = selectedNodes[0];
    const maxEdgeId = findCurrentMaxEdgeId(data);
    
    
    for (let i = 1; i < selectedNodes.length; i++) {
        
        const target = selectedNodes[i];
        // Checks if already such an edge exists
        if (!edgeExists(data, source, target)) {
            
            // Creates a new edge id
            const nextEdgeId = `edge${maxEdgeId + i}`;
            // Adds the new edge to the data
            data.edges[nextEdgeId] = { source, target };
        }
    }
    historyManager.addToHistory(data);
}

// Function which will add edges between all selected nodes
function addEdges(data, selectedNodes) {
    // Return if selected nodes are less than 2 - cannot create an edge
    if (selectedNodes.length < 2) return;
    
    const maxEdgeId = findCurrentMaxEdgeId(data);
    // Tracks how many new edges are created
    // So the next edge id can be generated
    let newEdgeCounter = 0;
    
    for (let srcIndex = 0; srcIndex < selectedNodes.length - 1; srcIndex++) {
        for (let trgtIndex = srcIndex + 1; trgtIndex < selectedNodes.length; trgtIndex++) {
            
            const source = selectedNodes[srcIndex];
            const target = selectedNodes[trgtIndex];
            if (!edgeExists(data, source, target)) {
                
                // Increase the counter by 1
                newEdgeCounter++;
                
                // Creates a new edge id
                const nextEdgeId = `edge${maxEdgeId + newEdgeCounter}`;
                // Adds the new edge to the data
                data.edges[nextEdgeId] = { source, target };
            }
        }
    }
    historyManager.addToHistory(data);
}
// This function will delete all edges between the nodes in the nodesToDeleteEdgesFrom array
function deleeteEdgesBasedOnNodes(data, nodesToDeleteEdgesFrom) {
    const edges = data.edges;
    const edgesToDelete = [];
    for (const [key, edge] of Object.entries(edges)) {
        // Only delete edges where both source and target are in nodesToDeleteEdgesFrom
        if (nodesToDeleteEdgesFrom.includes(edge.source) && nodesToDeleteEdgesFrom.includes(edge.target)) {
            edgesToDelete.push(key);
        }
    }
    deleteEdges(data, edgesToDelete);
}


function deleteEdges(data, edgesToDelete) {
    const edges = data.edges;
    const remainingEdges = {};
    for (const [key, edge] of Object.entries(edges)) {
        if (!edgesToDelete.includes(key)) {
            remainingEdges[key] = edge;
        }
    }
    data.edges = remainingEdges;
    historyManager.addToHistory(data);
}
// This function will change the name of selected nodes
function editNodes(data, selectedNodes, newName) {
    for (const nodeId of selectedNodes) {
        data.nodes[nodeId].name = newName;
    }
    historyManager.addToHistory(data);
}
// This function will empty the selected nodes and edges
function emptySelected(selectedNodes, selectedEdges) {
    selectedNodes.value = [];
    selectedEdges.value = [];
    
    return { selectedNodes, selectedEdges };
}

// Check if an edge already exists between two nodes
function edgeExists(data, source, target) {
    return Object.values(data.edges || {}).some(edge =>
        (edge.source === source && edge.target === target) ||
        (edge.source === target && edge.target === source)
    );
}
function findCurrentMaxNodeId(data) {
    return Math.max(
        ...Object.keys(data.nodes).map(key => parseInt(key.replace("node", ""), 10)),//10 = decimal
        0 // If there are no nodes, return 0
    );
}
function findCurrentMaxEdgeId(data) {
    return Math.max(
        ...Object.keys(data.edges || {}).map(key => parseInt(key.replace("edge", ""), 10)),//10 = decimal
        0 // If there are no edges, return 0
    );
}
// This function will move the history forward
function moveForward(data){
    historyManager.moveForward();
    const newdata = historyManager.getCurrentData();
    Object.assign(data, newdata);
}
// This function will move the history backward
function moveBackward(data){
    historyManager.moveBackward();
    const newdata = historyManager.getCurrentData();
    Object.assign(data, newdata);
}

export {
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
};