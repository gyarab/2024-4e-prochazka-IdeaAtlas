// This file contains the functions that are used to manage the graph data structure
export { addNewNode, deleteNodes, addEgesOneSource, editNodes, deleteEdges, addEdges, emptySelected };

// adds a new node to the graph
function addNewNode(data, newName, xMousePos, yMousePos) {
    // Find the largest numeric part of the existing keys
    const maxNodeId = findCurrentMaxNodeId(data);
    // Generate the next key
    const nextNodeId = `node${maxNodeId + 1}`;

    // Add the new node
    data.nodes[nextNodeId] = { name: newName };
    // Adds the new node to the layouts so its position is tracked
    data.layouts.nodes[nextNodeId] = { x: xMousePos, y: yMousePos };


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
}
// Function which will add to edges:
// With source as the first node in the array
// And target as all the other nodes in the array
// TODO - check if the edge already exists
function addEgesOneSource(data, selectedNodes) {
    // Return if selected nodes are less than 2 - cannot create an edge
    if (selectedNodes.length < 2) return;

    const source = selectedNodes[0];
    const maxEdgeId = findCurrentMaxEdgeId(data);


    for (let i = 1; i < selectedNodes.length; i++) {

        const target = selectedNodes[i];

        // Creates a new edge id
        const nextEdgeId = `edge${maxEdgeId + i}`;
        // Adds the new edge to the data
        data.edges[nextEdgeId] = { source, target };
    }
}

// Function which will add edges between all selected nodes
// TODO - check if the edge already exists
function addEdges(data, selectedNodes) {
    // Return if selected nodes are less than 2 - cannot create an edge
    if (selectedNodes.length < 2) return;
    console.log(selectedNodes)

    const maxEdgeId = findCurrentMaxEdgeId(data);
    // Tracks how many new edges are created
    // So the next edge id can be generated
    let newEdgeCounter = 0;

    for (let srcIndex = 0; srcIndex < selectedNodes.length - 1; srcIndex++) {
        for (let trgtIndex = srcIndex + 1; trgtIndex < selectedNodes.length; trgtIndex++) {
            console.log(srcIndex, trgtIndex)
            const source = selectedNodes[srcIndex];
            const target = selectedNodes[trgtIndex];
            // Increase the counter by 1
            newEdgeCounter++;
            console.log(newEdgeCounter)
            // Creates a new edge id
            const nextEdgeId = `edge${maxEdgeId + newEdgeCounter}`;
            // Adds the new edge to the data
            data.edges[nextEdgeId] = { source, target };
        }
    }
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
}
// This function will change the name of a node
function editNodes(data, selectedNodes, newName) {
    console.log("editNodes")
    for (const nodeId of selectedNodes) {
        console.log(nodeId)
        data.nodes[nodeId].name = newName;
    }
}
// This function will empty the selected nodes and edges
function emptySelected(selectedNodes, selectedEdges) {
    selectedNodes.value = [];
    selectedEdges.value = [];

    return { selectedNodes, selectedEdges };
}


function findCurrentMaxNodeId(data) {
    return Math.max(
        ...Object.keys(data.nodes).map(key => parseInt(key.replace("node", ""), 10)) //10 = decimal
    );
}
function findCurrentMaxEdgeId(data) {
    return Math.max(
        ...Object.keys(data.edges || {}).map(key => parseInt(key.replace("edge", ""), 10)) //10 = decimal
    );
}
