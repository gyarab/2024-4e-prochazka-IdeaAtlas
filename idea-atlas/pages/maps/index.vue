<script setup lang="ts">
import { fetchGraphMDataBasedOnUsr, deleteGraph } from '~/utils/graphMetadataService';
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
const searchQuery = ref('');
const debouncedSearch = ref('');

// Debounce the search input
watch(searchQuery, (newValue) => {
    debouncedSearch.value = newValue;
}, { immediate: true });

// Filter networks based on search query
const filteredNetworks = computed(() => 
    networks.value.filter(network => {
        const search = debouncedSearch.value.toLowerCase();
        if (!search) return true;
        
        return network.name.toLowerCase().includes(search) ||
               network.description.toLowerCase().includes(search);
    })
);

// Sort and filter for bookmarked section
const bookmarkedNetworks = computed(() => 
    filteredNetworks.value
        .filter(network => network.bookmarked)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
);

// Sort for all maps section
const regularNetworks = computed(() => 
    filteredNetworks.value
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
);

const showNewMapDialog = ref(false);
const showEditMapDialog = ref(false);
const selectedGraph = ref<GraphMetadata | null>(null);

const handleNewMap = () => {
    networks.value = [...networks.value];
};

const handleBookmarkUpdate = (updatedNetwork: GraphMetadata) => {
    const index = networks.value.findIndex(n => n.id === updatedNetwork.id);
    if (index !== -1) {
        networks.value[index] = updatedNetwork;
        networks.value = [...networks.value]; // Trigger reactivity
    }
};

const handleDelete = async (graphId: string) => {
    try {
        const success = await deleteGraph(supabase, graphId);
        if (success) {
            networks.value = networks.value.filter(network => network.id !== graphId);
        }
    } catch (error) {
        console.error('Error deleting network:', error);
    }
};

const handleEditMap = (graph: GraphMetadata) => {
    selectedGraph.value = graph;
    showEditMapDialog.value = true;
};

const handleEditSubmit = async (updatedGraph: GraphMetadata) => {
    const index = networks.value.findIndex(n => n.id === updatedGraph.id);
    if (index !== -1) {
        networks.value[index] = {
            ...networks.value[index],
            name: updatedGraph.name,
            description: updatedGraph.description,
            updated_at: new Date().toISOString()
        };
        networks.value = [...networks.value]; // Trigger reactivity
    }
    showEditMapDialog.value = false; // Close the dialog after successful edit
    selectedGraph.value = null; // Reset selected graph
};

onMounted(async () => {
    try {
        const data = await fetchGraphMDataBasedOnUsr(supabase);
        networks.value = data;
        console.log(networks.value);
    } catch (error) {
        console.error('Error fetching networks:', error);
    }
});
</script>

<template>
    <div class="container mx-auto p-4">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Your Mind Maps</h1>
            <div class="flex gap-4 items-center">
                <div class="relative">
                    <input
                        v-model="searchQuery"
                        type="search"
                        placeholder="Search maps..."
                        class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        autocomplete="off"
                    >
                    <i class="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                <button @click="showNewMapDialog = true" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Create New Map
                </button>
            </div>
        </div>

        <!-- Bookmarked Maps Section -->
        <div v-if="bookmarkedNetworks.length > 0" class="mb-8">
            <h2 class="text-xl font-semibold mb-4">Bookmarked Maps</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MapCard 
                    v-for="network in bookmarkedNetworks" 
                    :key="network.id" 
                    :graph="network"
                    @bookmark-updated="handleBookmarkUpdate"
                    @delete="handleDelete"
                    @edit="handleEditMap"
                />
            </div>
        </div>

        <!-- All Maps Section -->
        <div>
            <h2 class="text-xl font-semibold mb-4">All Maps</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MapCard 
                    v-for="network in regularNetworks" 
                    :key="network.id" 
                    :graph="network"
                    @bookmark-updated="handleBookmarkUpdate"
                    @delete="handleDelete"
                    @edit="handleEditMap"
                />
            </div>
        </div>

        <NewMapDialog v-model="showNewMapDialog" @submit="handleNewMap" />
        <EditMapDialog 
            v-if="selectedGraph"
            v-model="showEditMapDialog"
            :graph="selectedGraph"
            @update:modelValue="(val) => { if (!val) { selectedGraph = null; } }"
            @submit="handleEditSubmit"
        />
    </div>
</template>

<style scoped>
.container {
    min-height: calc(100vh - 4rem);
}
</style>