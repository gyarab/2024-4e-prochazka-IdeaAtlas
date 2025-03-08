// This file contains the functions that are used to manage the graph data structure
import { historyManager } from "./graphHistory";
import { EDGE_NOTE_RATIO } from "~/config/constants";

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

/**
 * Force-directed layout algorithm to adjust node positions based on repulsive and attractive forces.
 * Uses a physics-based approach where nodes repel each other and edges act like springs.
 * 
 * @param {Object} data - The graph data containing nodes and edges
 */
function adjustNodeLayouts(data) {
    // Find the biggest node
    let biggestNodeId = null;
    let maxSize = -1;
    
    Object.entries(data.nodes).forEach(([nodeId, node]) => {
        if (node.size > maxSize) {
            maxSize = node.size;
            biggestNodeId = nodeId;
        }
    });

    // Refined constants for more stable simulation
    const BASE_REPULSION = 50;     // Reduced base repulsion
    const BASE_MIN_DISTANCE = 300; // Increased minimum distance
    const ATTRACTION = 0.05;       // Reduced attraction
    const DAMPING = 0.7;          // Increased damping
    const MAX_FORCE = 10;         // Maximum force cap
    const MIN_FORCE = 0.01;       // Minimum force threshold
    
    // Initialize velocity vectors if needed
    if (!data.layouts.velocity) {
        data.layouts.velocity = {};
        Object.keys(data.layouts.nodes).forEach(nodeId => {
            data.layouts.velocity[nodeId] = { x: 0, y: 0 };
        });
    }

    const nodes = data.layouts.nodes;
    const edges = data.edges;

    // Helper function to cap force
    const capForce = (force) => {
        const magnitude = Math.sqrt(force.x * force.x + force.y * force.y);
        if (magnitude > MAX_FORCE) {
            const scale = MAX_FORCE / magnitude;
            return { x: force.x * scale, y: force.y * scale };
        }
        if (magnitude < MIN_FORCE) {
            return { x: 0, y: 0 };
        }
        return force;
    };

    // Calculate and apply forces to all nodes except the biggest one
    Object.keys(nodes).forEach(nodeId1 => {
        if (nodeId1 === biggestNodeId) {
            data.layouts.velocity[nodeId1] = { x: 0, y: 0 };
            nodes[nodeId1].x = 0;
            nodes[nodeId1].y = 0;
            return;
        }

        let force = { x: 0, y: 0 };

        // Calculate repulsive forces with size consideration
        Object.keys(nodes).forEach(nodeId2 => {
            if (nodeId1 === nodeId2) return;

            const node1Size = data.nodes[nodeId1].size;
            const node2Size = data.nodes[nodeId2].size;
            
            const sizeScale = (node1Size + node2Size) / 100;
            const minDistance = BASE_MIN_DISTANCE * sizeScale;

            const dx = nodes[nodeId1].x - nodes[nodeId2].x;
            const dy = nodes[nodeId1].y - nodes[nodeId2].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
                // Exponential repulsion for close nodes
                const repulsion = BASE_REPULSION * Math.exp(minDistance / Math.max(distance, 1));
                const repulsionForce = repulsion * sizeScale;
                
                // Normalize direction vector
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;
                
                force.x += normalizedDx * repulsionForce;
                force.y += normalizedDy * repulsionForce;
            }
        });

        // Calculate attractive forces along edges
        Object.values(edges).forEach(edge => {
            if (edge.source === nodeId1 || edge.target === nodeId1) {
                const otherNodeId = edge.source === nodeId1 ? edge.target : edge.source;
                const dx = nodes[nodeId1].x - nodes[otherNodeId].x;
                const dy = nodes[nodeId1].y - nodes[otherNodeId].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Skip if nodes are too close
                if (distance < BASE_MIN_DISTANCE / 2) return;

                const nodeSize = data.nodes[nodeId1].size;
                const sizeFactor = nodeSize / 100;
                const scaledAttraction = ATTRACTION * sizeFactor;

                force.x -= (dx * scaledAttraction);
                force.y -= (dy * scaledAttraction);
            }
        });

        // Cap and apply forces
        force = capForce(force);
        
        // Update velocity with capped force
        data.layouts.velocity[nodeId1].x = (data.layouts.velocity[nodeId1].x + force.x) * DAMPING;
        data.layouts.velocity[nodeId1].y = (data.layouts.velocity[nodeId1].y + force.y) * DAMPING;
        
        // Apply capped velocity to position
        const velocity = capForce(data.layouts.velocity[nodeId1]);
        nodes[nodeId1].x += velocity.x;
        nodes[nodeId1].y += velocity.y;
    });

    historyManager.addToHistory(data);
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
    moveBackward,
    updateEdgeColors,
    adjustNodeLayouts
};