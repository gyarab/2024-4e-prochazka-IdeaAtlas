//this file is responsible for fetching and upserting graph data to the database

//TODO - hardcoded
const graph_id = "8bedcacd-0049-4f32-a1e5-4fe72a2080d2";


//exports the functions so they can be used in other files
export default {upsertGraphData, fetchGraph}


// Upsert nodes into the 'nodes' table in the Supabase database
//supabse must be passed from somhwere where it is part of nuxt life cycle
async function upsertNodes(supabase, nodes) {
  // Extract node values and map them to an array of objects for insertion
  const nodesToInsert = Object.entries(nodes).map(([key, node]) => ({
    id: graph_id + key,
    node_id_in_graph: key,
    name: node.name,
    graph_id: graph_id,
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
//supabse must be passed from somhwere where it is part of nuxt life cycle
async function upsertEdges(supabase, edges) {
  // Extract edge values and map them to an array of objects for insertion
  const edgesToInsert = Object.entries(edges).map(([key, edge]) => ({
    id: graph_id + key,
    edge_id_in_graph: key,
    source: edge.source,
    target: edge.target,
    graph_id: graph_id
  }));
  // Insert edges into the table
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
//supabse must be passed from somhwere where it is part of nuxt life cycle
async function upsertLayouts(supabase, layouts) {
  // Extract layout values and map them to an array of objects for insertion
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
async function upsertGraphData(supabase, data){
  upsertNodes(supabase, data.nodes);
  upsertEdges(supabase, data.edges);
  upsertLayouts(supabase, data.layouts);
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
    acc[node.node_id_in_graph] = { name: node.name };
    return acc;
  }, {});

  // Reconstruct edges
  const edges = edgesData.reduce((acc, edge) => {
    acc[edge.edge_id_in_graph] = { source: edge.source, target: edge.target };
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
