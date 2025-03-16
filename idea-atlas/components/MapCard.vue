<template>
    <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow relative">
        <div class="absolute top-2 right-2 flex gap-2">
            <button 
                @click.prevent="handleEdit"
                class="text-gray-400 hover:text-blue-500 transition-colors"
                title="Edit map"
            >
                <i class="fas fa-edit"></i>
            </button>
            <button 
                @click.prevent="handleDelete"
                class="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete map"
            >
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="flex items-center gap-2 mb-2">
            <NuxtLink :to="`/maps/${graph.id}`" class="hover:text-blue-600 transition-colors">
                <h2 class="text-xl font-semibold">{{ graph.name }}</h2>
            </NuxtLink>
            <button 
                @click="toggleBookmark" 
                class="text-xl focus:outline-none hover:scale-110 transition-transform cursor-pointer p-1"
                :disabled="isUpdating"
            >
                <i class="fa-star" :class="[
                    isUpdating ? 'fas text-gray-300 animate-pulse' :
                    localBookmarked ? 'fas text-yellow-500' : 'far text-gray-400'
                ]"></i>
            </button>
        </div>
        <p class="text-gray-600 mb-3 line-clamp-2">{{ graph.description }}</p>
        <div class="flex flex-col gap-1 text-sm text-gray-500">
            <span>Created: {{ formatDate(graph.created_at) }}</span>
            <span>Updated: {{ formatDate(graph.updated_at) }}</span>
        </div>
        <NuxtLink :to="`/maps/${graph.id}`" 
                 class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Open Map
        </NuxtLink>
        <DeleteConfirmDialog
            v-model="showDeleteDialog"
            @confirm="confirmDelete"
        />
    </div>
</template>

<script setup lang="ts">
import { updateBookMarked } from '~/utils/graphMetadataService';
// Define the Props interface for component properties
interface Props {
    graph: {
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

const isUpdating = ref(false);
const localBookmarked = ref(props.graph.bookmarked);

const toggleBookmark = async () => {
    if (isUpdating.value) return;
    
    isUpdating.value = true;
    const newBookmarkState = !localBookmarked.value;
    
    try {
        
        localBookmarked.value = newBookmarkState;
        
        const updatedNetwork = await updateBookMarked(supabase, {
            id: props.graph.id,
            bookmarked: newBookmarkState
        });
        
        emit('bookmark-updated', {
            ...props.graph,
            bookmarked: newBookmarkState
        });
    } catch (error) {
        // Revert on error
        localBookmarked.value = !newBookmarkState;
        console.error('Error updating bookmark:', error);
    } finally {
        isUpdating.value = false;
    }
};

// Keep local state in sync with props
watch(() => props.graph.bookmarked, (newVal) => {
    localBookmarked.value = newVal;
});

const emit = defineEmits<{
    'bookmark-updated': [network: Props['graph']],
    'delete': [id: string],
    'edit': [graph: Props['graph']]
}>();

const showDeleteDialog = ref(false);

const handleDelete = () => {
    showDeleteDialog.value = true;
};

const confirmDelete = () => {
    emit('delete', props.graph.id);
};

const handleEdit = () => {
    emit('edit', props.graph);
};
</script>

<style scoped>
.fa-star {
    display: inline-block;
    width: 1em;
    height: 1em;
}
</style>