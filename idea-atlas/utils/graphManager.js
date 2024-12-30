// This file contains the functions that are used to manage the graph data structure

// adds a new node to the graph
function addNewNode(nodes, newName) {
    // Find the largest numeric part of the existing keys
    const maxNodeId = Math.max(
        ...Object.keys(nodes).map(key => parseInt(key.replace("node", ""), 10))
    );
    // Generate the next key
    const nextNodeId = `node${maxNodeId + 1}`;

    // Add the new node
    nodes[nextNodeId] = { name: newName };
}


export default { addNewNode };