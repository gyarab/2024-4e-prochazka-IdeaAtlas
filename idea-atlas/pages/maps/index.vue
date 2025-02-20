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
const bookmarkedNetworks = computed(() => 
    networks.value
        .filter(network => network.bookmarked)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
);
const regularNetworks = computed(() => 
    networks.value
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
);

const showNewMapDialog = ref(false);

const handleNewMap = () => {
    networks.value = [...networks.value];
};

onMounted(async () => {
    try {
        const data = await fetchGraphMDataBasedOnUsr(supabase);
        networks.value = data;
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

        <!-- Bookmarked Maps Section -->
        <div v-if="bookmarkedNetworks.length > 0" class="mb-8">
            <h2 class="text-xl font-semibold mb-4">Bookmarked Maps</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MapCard v-for="network in bookmarkedNetworks" :key="network.id" :graph="network" />
            </div>
        </div>

        <!-- All Maps Section -->
        <div>
            <h2 class="text-xl font-semibold mb-4">All Maps</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MapCard v-for="network in regularNetworks" :key="network.id" :graph="network" />
            </div>
        </div>

        <NewMapDialog v-model="showNewMapDialog" @submit="handleNewMap" />
    </div>
</template>

<style scoped>
.container {
    min-height: calc(100vh - 4rem);
}
</style>