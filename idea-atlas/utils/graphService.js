//TODO - hardcoded
const graph_id = "8bedcacd-0049-4f32-a1e5-4fe72a2080d2";

// Insert nodes into the 'nodes' table in the Supabase database
//supabse must be passed from somhwere where it is part of nuxt life cycle
async function insertNodes(supabase, nodes) {
  // Extract node values and map them to an array of objects for insertion
  const nodesToInsert = Object.values(nodes).map(node => ({
    name: node.name,
    graph_id: graph_id
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
async function insertEdges(supabase, edges) {
  // Extract edge values and map them to an array of objects for insertion
  const edgesToInsert = Object.values(edges).map(edge => ({
    source: edge.source,
    target: edge.target
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
export default insertNodes;