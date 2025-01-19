<script setup lang="ts">
    import { fetchGraphMDataBasedOnUsr } from '~/utils/graphMetadataService';
    const supabase = useSupabaseClient();

    interface GraphMetadata {
        id: string;
        name: string;
        // TODO
        // description: string;
        created_at: string;
        // TODO 
        // updated_at: string;
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };
</script>

<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-6">Your Mind Maps</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="network in networks" 
                 :key="network.id" 
                 class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <h2 class="text-xl font-semibold mb-2">{{ network.name }}</h2>
                <!-- <p class="text-gray-600 mb-4">{{ network.description }}</p> -->
                <div class="flex justify-between text-sm text-gray-500">
                    <span>Created: {{ formatDate(network.created_at) }}</span>
                    <!-- <span>Updated: {{ formatDate(network.updated_at) }}</span> -->
                </div>
                <NuxtLink :to="`/maps/${network.id}`" 
                         class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Open Map
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    min-height: calc(100vh - 4rem);
}
</style>