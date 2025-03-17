// This file contains the functions that are used to manage the graph data structure
import { historyManager } from "./graphHistory";
import { EDGE_NOTE_RATIO } from "~/config/constants";

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
async function deleteNodes(data, nodesToDelete) {
    // console.log("Nodes to delete:");
    // console.log(nodesToDelete);
    // console.log("Data before deletion:");
    // console.log(data);
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
    
    // WTF
    // From some uknown reason the layouts are bugged
    // But make sure to add a delay 
    // Helps to avoid the bug
    /*
    Have no idea what is the correct solution
    But this works for now
    */
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(100); // Add a small delay for debugging
    
    
    // Clean up layouts
    const layouts = data.layouts;
    for (const nodeId of nodesToDelete) {
        delete layouts.nodes[nodeId];
    }
    data.layouts = layouts;

    // Adds the new data to the history
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
            const edgeProps = getLargerNodeProperties(data, source, target);
            data.edges[nextEdgeId] = { 
                source, 
                target, 
                color: edgeProps.color,
                width: edgeProps.width
            };
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
                const edgeProps = getLargerNodeProperties(data, source, target);
                data.edges[nextEdgeId] = { 
                    source, 
                    target, 
                    color: edgeProps.color,
                    width: edgeProps.width
                };
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
    console.log("Edges to delete:");
    console.log(edgesToDelete);
    console.log("Data before deletion:");
    console.log(data);
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
function editNodes(data, selectedNodes, changes) {
    selectedNodes.forEach(nodeId => {
        data.nodes[nodeId] = {
            ...data.nodes[nodeId],
            ...changes
        };
        // Update colors of all edges connected to this node
        updateEdgeColors(data, nodeId);
    });
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

// Function to update edge colors based on connected nodes
function updateEdgeColors(data, nodeId) {
    Object.entries(data.edges).forEach(([edgeId, edge]) => {
        if (edge.source === nodeId || edge.target === nodeId) {
            // Get the connected node (the one that's not being edited)
            const otherNodeId = edge.source === nodeId ? edge.target : edge.source;
            // Update edge color based on the larger node
            const edgeProps = getLargerNodeProperties(data, nodeId, otherNodeId);
            data.edges[edgeId].color = edgeProps.color;
            data.edges[edgeId].width = edgeProps.width;
        }
    });
}

// Helper function to calculate edge width based on node size
function calculateEdgeWidth(nodeSize) {
    // Convert node size (10-100) to edge width (1-5)
    return 1 + (nodeSize / EDGE_NOTE_RATIO);
}

function getLargerNodeProperties(data, source, target) {
    const sourceSize = data.nodes[source].size;
    const targetSize = data.nodes[target].size;
    const largerNode = sourceSize >= targetSize ? data.nodes[source] : data.nodes[target];
    return {
        color: largerNode.color,
        width: calculateEdgeWidth(largerNode.size)
    };
}

// Function which will recusively select all the nodes connected to the selected node
async function waveNodeSelect(data, selectedNodes, callback) {
    const visited = new Set(selectedNodes);
    const newlySelected = [];
    
    // Get connected nodes that haven't been visited
    Object.values(data.edges).forEach(edge => {
        const source = edge.source;
        const target = edge.target;
        
        if (selectedNodes.includes(source) && !visited.has(target)) {
            visited.add(target);
            newlySelected.push(target);
        }
        if (selectedNodes.includes(target) && !visited.has(source)) {
            visited.add(source);
            newlySelected.push(source);
        }
    });

    if (newlySelected.length > 0) {
        callback(newlySelected);
    }
    
    return newlySelected;
}

export {
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
    updateEdgeColors,
    waveNodeSelect
};