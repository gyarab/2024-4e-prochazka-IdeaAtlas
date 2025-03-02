//this file is responsible for fetching and upserting graph data to the database

//exports the functions so they can be used in other files
export default {upsertGraphData, fetchGraph}

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
