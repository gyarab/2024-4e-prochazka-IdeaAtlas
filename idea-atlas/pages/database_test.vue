
<template>
    <div>
        <h1>Test</h1>
        <button @click="insertNode">Insert Node</button>
    </div>
</template>

<script setup>
const supabase = useSupabaseClient();

async function insertNode() {
  const { error } = await supabase
    .from('test')
    .insert({ id: 1, name: 'Denmark' });
  if (error) {
    console.error(error);
  } else {
    console.log('Node inserted successfully');
  }
}
</script>