//TODO - hardcoded
const graph_id = "8bedcacd-0049-4f32-a1e5-4fe72a2080d2";

// Insert nodes into the 'nodes' table in the Supabase database
//supabse must be passed from somhwere where it is part of nuxt life cycle
async function insertNodes(supabase, nodes) {
  // Extract node values and map them to an array of objects for insertion
  const nodesToInsert = Object.entries(nodes).map(([key, node]) => ({
    node_id_in_graph: key,
    name: node.name,
    graph_id: graph_id,
  }));
  
  const { error } = await supabase
    .from('nodes')
    .insert(nodesToInsert);

  if (error) {
    console.error('Error inserting nodes:', error);
  } else {
    console.log('Nodes inserted successfully');
  }
}


// Insert edges into the 'edges' table in the Supabase database
//supabse must be passed from somhwere where it is part of nuxt life cycle
async function insertEdges(supabase, edges) {
  // Extract edge values and map them to an array of objects for insertion
  const edgesToInsert = Object.entries(edges).map(([key, edge]) => ({
    edge_id_in_graph: key,
    source: edge.source,
    target: edge.target,
    graph_id: graph_id
  }));
  // Insert edges into the table
  const { data, error } = await supabase
    .from('edges')
    .insert(edgesToInsert);

  if (error) {
    console.error('Error inserting edges:', error);
  } else {
    console.log('Edges inserted successfully:', data);
  }

}


// Insert layouts into the 'layouts' table in the Supabase database
//supabse must be passed from somhwere where it is part of nuxt life cycle
async function insertLayouts(supabase, layouts) {
  // Extract layout values and map them to an array of objects for insertion
  const layoutsToInsert = Object.entries(layouts.nodes).map(([key, layout]) => ({
    node_id_in_graph: key,
    x: layout.x,
    y: layout.y,
    graph_id: graph_id,
  }));

  const { error } = await supabase
    .from('layouts')
    .insert(layoutsToInsert);

  if (error) {
    console.error('Error inserting layouts:', error);
  } else {
    console.log('Layouts inserted successfully');
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




//TODO insert function for whole graph
//exports the functions so they can be used in other files
export default {insertNodes, insertEdges, insertLayouts, fetchGraph}