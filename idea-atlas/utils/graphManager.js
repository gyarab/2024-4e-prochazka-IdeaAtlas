// This file contains the functions that are used to manage the graph data structure
export default { addNewNode, deleteNodes };

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

    // Spares only the nodes which are not contained in the nodesToDelete Object
    for (const [key, value] of Object.entries(nodes)) {
        if (!nodesToDelete.has(key)) {
            remainingNodes[key] = value;
        }
    }

    // Updates the nodes object
    data.nodes = remainingNodes;

    // Removes the edges which contain any of the nodes to be deleted
    const edges = data.edges;
    const remainingEdges = {};
    for (const [key, edge] of Object.entries(edges)) {
        // Check for the source and target nodes in the nodesToDelete Object
        if (!nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target)) {
            remainingEdges[key] = edge;
        }
    }
    data.edges = remainingEdges;

    // Clean up layouts
    // of - iterates over the keys of the nodesToDelete Object
    for (const nodeId of nodesToDelete) {
        delete data.layouts.nodes[nodeId];
    }

}





function findCurrentMaxNodeId(data) {
    return Math.max(
        ...Object.keys(data.nodes).map(key => parseInt(key.replace("node", ""), 10))
    );
}
