// This file contains the functions that are used to manage the graph data structure
export default { addNewNode };

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





function findCurrentMaxNodeId(data) {
    return Math.max(
        ...Object.keys(data.nodes).map(key => parseInt(key.replace("node", ""), 10))
    );
}
