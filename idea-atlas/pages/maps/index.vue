<script setup lang="ts">
    import { fetchGraphMDataBasedOnUsr } from '~/utils/graphMetadataService';
    const supabase = useSupabaseClient();
    
    onMounted(async () => {
        console.log('mounted');
        const id_data = fetchGraphMDataBasedOnUsr(supabase)
        console.log(id_data);
    });


</script>
<template>
    <div>
        <h1>This is default page for maps</h1>
    </div>
</template>


<style scoped>

</style>