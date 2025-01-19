<script setup lang="ts">
    import { fetchGraphMDataBasedOnUsr } from '~/utils/graphMetadataService';
    const supabase = useSupabaseClient();

    interface GraphMetadata {
        id: string;
        name: string;
        created_at: string;
    }

    const networks = ref<GraphMetadata[]>([]);

    onMounted(async () => {
        try {
            const data = await fetchGraphMDataBasedOnUsr(supabase);
            networks.value = data.sort((a: GraphMetadata, b: GraphMetadata) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
        } catch (error) {
            console.error('Error fetching networks:', error);
        }
    });
</script>

<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-6">Your Mind Maps</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MapCard v-for="network in networks" 
                    :key="network.id"
                    :network="network" />
        </div>
    </div>
</template>

<style scoped>
.container {
    min-height: calc(100vh - 4rem);
}
</style>