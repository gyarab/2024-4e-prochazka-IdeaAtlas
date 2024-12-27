import data from "../utils/data"


const nodes = data.nodes
console.log("hello");
console.log(nodes);
async function insertNodes(nodes) {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    console.error('Please provide a non-empty array of nodes.');
    return;
  }

  const { error } = await supabase
    .from('nodes')
    .insert(nodes);
  
  if (error) {
    console.error('Error inserting nodes:', error);
  } else {
    console.log('Nodes inserted successfully');
  }
}