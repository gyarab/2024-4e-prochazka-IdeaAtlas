<template>
    <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div class="flex items-center gap-2 mb-2">
            <h2 class="text-xl font-semibold">{{ network.name }}</h2>
            <button 
                @click="toggleBookmark" 
                class="text-xl focus:outline-none hover:scale-110 transition-transform cursor-pointer p-1"
            >
                <!-- Changed icon classes to ensure compatibility -->
                <i class="fa-star" :class="[
                    network.bookmarked ? 'fas text-yellow-500' : 'far text-gray-400'
                ]"></i>
            </button>
        </div>
        <p class="text-gray-600 mb-3 line-clamp-2">{{ network.description }}</p>
        <div class="flex flex-col gap-1 text-sm text-gray-500">
            <span>Created: {{ formatDate(network.created_at) }}</span>
            <span>Updated: {{ formatDate(network.updated_at) }}</span>
        </div>
        <NuxtLink :to="`/maps/${network.id}`" 
                 class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Open Map
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import { upsertBookMarked } from '~/utils/graphMetadataService';
// Define the Props interface for component properties
interface Props {
    network: {
        id: string;        // Unique identifier for the network
        name: string;      // Display name of the network
        created_at: string; // Creation timestamp
        updated_at: string; // Last update timestamp
        bookmarked: boolean; // Whether the network is bookmarked
        description: string; // Description of the network
    }
}

// Initialize props using Vue's defineProps with the Props interface
const props = defineProps<Props>();

// Helper function to format date strings to localized format
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
};

const supabase = useSupabaseClient();

const toggleBookmark = async () => {
    try {
        const updatedNetwork = { ...props.network, bookmarked: !props.network.bookmarked };
        await upsertBookMarked(supabase, updatedNetwork);
        // Emit event to refresh parent component
        emit('bookmark-updated', updatedNetwork);
    } catch (error) {
        console.error('Error updating bookmark:', error);
    }
};

const emit = defineEmits<{
    'bookmark-updated': [network: Props['network']]
}>();
</script>

<style scoped>
.fa-star {
    display: inline-block;
    width: 1em;
    height: 1em;
}
</style>