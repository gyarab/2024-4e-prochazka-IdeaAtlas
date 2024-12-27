
<template>
    <div>
        <h1>Test</h1>
        <button @click="insertGraph">Insert Node</button>
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
</script>