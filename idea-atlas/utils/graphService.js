//this file is responsible for fetching and upserting graph data to the database

//exports the functions so they can be used in other files
export default {saveGraph, fetchGraph}

// Upsert nodes into the 'nodes' table in the Supabase database
async function upsertNodes(supabase, nodes, graph_id) {
  const nodesToInsert = Object.entries(nodes).map(([key, node]) => ({
    id: graph_id + key,
    graph_id: graph_id,
    node_id_in_graph: key,
    name: node.name,
    color: node.color,
    size: node.size
  }));
  
  const { error } = await supabase
    .from('nodes')
    .upsert(nodesToInsert);

  if (error) {
    console.error('Error inserting nodes:', error);
  } else {
    console.log('Nodes inserted successfully');
  }
}

// Upsert edges into the 'edges' table in the Supabase database
async function upsertEdges(supabase, edges, graph_id) {
  const edgesToInsert = Object.entries(edges).map(([key, edge]) => ({
    id: graph_id + key,
    graph_id: graph_id,
    edge_id_in_graph: key,
    source: edge.source,
    target: edge.target,
    color: edge.color,
    width: edge.width
  }));
  
  const { error } = await supabase
    .from('edges')
    .upsert(edgesToInsert);

  if (error) {
    console.error('Error inserting edges:', error);
  } else {
    console.log('Edges inserted successfully');
  }
}

// Upsert layouts into the 'layouts' table in the Supabase database
async function upsertLayouts(supabase, layouts, graph_id) {
  const layoutsToInsert = Object.entries(layouts.nodes).map(([key, layout]) => ({
    id: graph_id + key,
    node_id_in_graph: key,
    x: layout.x,
    y: layout.y,
    graph_id: graph_id,
  }));

  const { error } = await supabase
    .from('layouts')
    .upsert(layoutsToInsert);

  if (error) {
    console.error('Error inserting layouts:', error);
  } else {
    console.log('Layouts inserted successfully');
  }
}

//upserts whole graph data
async function upsertGraphData(supabase, data, graph_id){
  upsertNodes(supabase, data.nodes, graph_id);
  upsertEdges(supabase, data.edges, graph_id);
  upsertLayouts(supabase, data.layouts, graph_id);
}

// Fetch all ids of specific graph from the database
async function fetchAllIds(supabase, graph_id) {
  try {
    // Fetch node IDs
    const { data: nodeIds, error: nodesError } = await supabase
      .from('nodes')
      .select('node_id_in_graph')
      .eq('graph_id', graph_id);
    if (nodesError) throw nodesError;

    // Fetch edge IDs
    const { data: edgeIds, error: edgesError } = await supabase
      .from('edges')
      .select('edge_id_in_graph')
      .eq('graph_id', graph_id);
    if (edgesError) throw edgesError;

    // Fetch layout IDs
    const { data: layoutIds, error: layoutsError } = await supabase
      .from('layouts')
      .select('node_id_in_graph')
      .eq('graph_id', graph_id);
    if (layoutsError) throw layoutsError;

    return {
      nodeIds: nodeIds.map(node => node.node_id_in_graph),
      edgeIds: edgeIds.map(edge => edge.edge_id_in_graph),
      layoutIds: layoutIds.map(layout => layout.node_id_in_graph)
    };
  } catch (error) {
    console.error('Error fetching IDs:', error);
    throw error;
  }
}

// Filters out data that exists in DB but not in current graph
async function filterDeletedData(data, ids_in_db) {
  const nodesToDelete = ids_in_db.nodeIds.filter(id => !Object.keys(data.nodes).includes(id));
  const edgesToDelete = ids_in_db.edgeIds.filter(id => !Object.keys(data.edges || {}).includes(id));
  const layoutsToDelete = ids_in_db.layoutIds.filter(id => !Object.keys(data.layouts.nodes).includes(id));
  return { nodesToDelete, edgesToDelete, layoutsToDelete };
}

// Deletes nodes from the database
async function deleteNodes(supabase, nodesToDelete, graph_id) {
  if (nodesToDelete.length === 0) return;
  
  const ids = nodesToDelete.map(nodeId => graph_id + nodeId);
  const { error } = await supabase
    .from('nodes')
    .delete()
    .in('id', ids);
  
  if (error) {
    console.error('Error deleting nodes:', error);
    throw error;
  }
  console.log('Nodes deleted successfully');
}

// Deletes edges from the database
async function deleteEdges(supabase, edgesToDelete, graph_id) {
  if (edgesToDelete.length === 0) return;
  
  const ids = edgesToDelete.map(edgeId => graph_id + edgeId);
  const { error } = await supabase
    .from('edges')
    .delete()
    .in('id', ids);
  
  if (error) {
    console.error('Error deleting edges:', error);
    throw error;
  }
  console.log('Edges deleted successfully');
}

// Deletes layouts from the database
async function deleteLayouts(supabase, layoutsToDelete, graph_id) {
  if (layoutsToDelete.length === 0) return;
  
  const ids = layoutsToDelete.map(layoutId => graph_id + layoutId);
  const { error } = await supabase
    .from('layouts')
    .delete()
    .in('id', ids);
  
  if (error) {
    console.error('Error deleting layouts:', error);
    throw error;
  }
  console.log('Layouts deleted successfully');
}

// Saves the graph data to the database
async function saveGraph(supabase, data, graph_id) {
  try {
    // Get current IDs from database
    const ids_in_db = await fetchAllIds(supabase, graph_id);
    
    // Find items to delete
    const { nodesToDelete, edgesToDelete, layoutsToDelete } = await filterDeletedData(data, ids_in_db);
    
    // Delete items in correct order to handle foreign key constraints
    // First delete edges
    await deleteEdges(supabase, edgesToDelete, graph_id);
    
    // Then delete layouts for the nodes that will be deleted
    await deleteLayouts(supabase, nodesToDelete, graph_id);
    
    // Finally delete the nodes
    await deleteNodes(supabase, nodesToDelete, graph_id);
    
    // Now upsert all current data
    await upsertGraphData(supabase, data, graph_id);
    
    console.log('Graph saved successfully');
  } catch (error) {
    console.error('Error saving graph:', error);
    throw error;
  }
}

async function fetchData(supabase, graph_id) {
  // Fetch nodes
  const { data: nodesData, error: nodesError } = await supabase
    .from('nodes')
    .select('*')
    .eq('graph_id', graph_id);
  if (nodesError) throw nodesError;

  // Fetch edges
  const { data: edgesData, error: edgesError } = await supabase
    .from('edges')
    .select('*')
    .eq('graph_id', graph_id);
  if (edgesError) throw edgesError;

  // Fetch layouts
  const { data: layoutsData, error: layoutsError } = await supabase
    .from('layouts')
    .select('*')
    .eq('graph_id', graph_id);
  if (layoutsError) throw layoutsError;

  return { nodesData, edgesData, layoutsData };
}

//acc = accumulator - reduces the incoming data
function reconstructData(nodesData, edgesData, layoutsData) {
  // Reconstruct nodes
  const nodes = nodesData.reduce((acc, node) => {
    acc[node.node_id_in_graph] = { name: node.name, color: node.color, size: node.size};
    return acc;
  }, {});

  // Reconstruct edges
  const edges = edgesData.reduce((acc, edge) => {
    acc[edge.edge_id_in_graph] = { source: edge.source, target: edge.target, color: edge.color, width: edge.width};
    return acc;
  }, {});

  // Reconstruct layouts
  const layouts = {
    nodes: layoutsData.reduce((acc, layout) => {
      acc[layout.node_id_in_graph] = { x: layout.x, y: layout.y };
      return acc;
    }, {}),
  };

  return { nodes, edges, layouts };
}

// This function fetches all the data for certain graph from the database and reconstructs it into the graph data structure
async function fetchGraph(supabase, graph_id) {
  try {
    const { nodesData, edgesData, layoutsData } = await fetchData(supabase, graph_id);
    const { nodes, edges, layouts } = reconstructData(
      nodesData,
      edgesData,
      layoutsData
    );
    return { nodes, edges, layouts };
  } catch (error) {
    console.error('Error fetching or reconstructing data:', error);
  }
}
