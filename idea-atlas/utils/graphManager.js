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

    //TODO - remove edges that are connected to the deleted nodes + layouts
}





function findCurrentMaxNodeId(data) {
    return Math.max(
        ...Object.keys(data.nodes).map(key => parseInt(key.replace("node", ""), 10))
    );
}
