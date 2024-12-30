// This file contains the functions that are used to manage the graph data structure
export default { addNewNode };

// adds a new node to the graph

function addNewNode(data, newName) {
    // Find the largest numeric part of the existing keys
    const maxNodeId = findCurrentMaxNodeId(data);
    // Generate the next key
    const nextNodeId = `node${maxNodeId + 1}`;
    
    // Add the new node
    data.nodes[nextNodeId] = { name: newName };
}

function findCurrentMaxNodeId(data) {
    return Math.max(
        ...Object.keys(data.nodes).map(key => parseInt(key.replace("node", ""), 10))
    );
}
