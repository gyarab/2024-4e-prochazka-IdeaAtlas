<script setup lang="ts">
import { fetchGraphMDataBasedOnUsr } from '~/utils/graphMetadataService';
const supabase = useSupabaseClient();

interface GraphMetadata {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    bookmarked: boolean;
    description: string;
}

const networks = ref<GraphMetadata[]>([]);

const showNewMapDialog = ref(false);

const handleNewMap = () => {
    networks.value = [...networks.value];
};

onMounted(async () => {
    // Try to fetch and sort graph metadata
    try {
        // Fetch graph metadata for current user
        const data = await fetchGraphMDataBasedOnUsr(supabase);
        // Sort networks by creation date (newest first)
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
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Your Mind Maps</h1>
            <button @click="showNewMapDialog = true" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Create New Map
            </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MapCard v-for="network in networks" :key="network.id" :network="network" />
        </div>
        <NewMapDialog v-model="showNewMapDialog" @submit="handleNewMap" />
    </div>
</template>

<style scoped>
.container {
    min-height: calc(100vh - 4rem);
}
</style>