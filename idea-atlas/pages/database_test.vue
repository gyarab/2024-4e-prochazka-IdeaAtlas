
<template>
    <div>
        <h1>Test</h1>
        <button @click="insertGraphs([
  { name: 'Raketa' },
  { name: 'Sputnik' },
  { name: 'Voyager' }
]);">Insert Node</button>
    </div>
</template>

<script setup>
const supabase = useSupabaseClient();

async function insertGraph() {
  const { error } = await supabase
    .from('graphs')
    .insert({name: 'Raketa' });
  if (error) {
    console.error(error);
  } else {
    console.log('Node inserted successfully');
  }
}
async function insertGraphs(graphs) {
  if (!Array.isArray(graphs) || graphs.length === 0) {
    console.error('Please provide a non-empty array of graphs.');
    return;
  }

  const { error } = await supabase
    .from('graphs')
    .insert(graphs);
  
  if (error) {
    console.error('Error inserting graphs:', error);
  } else {
    console.log('Graphs inserted successfully');
  }
}

</script>