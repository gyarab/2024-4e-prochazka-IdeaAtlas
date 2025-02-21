<template>
    <!-- Modal overlay with dark background -->
    <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <!-- Modal content container -->
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 class="text-xl font-semibold mb-4">Edit Map</h2>
            
            <!-- Form handling prevent default submit behavior -->
            <form @submit.prevent="handleSubmit">
                <!-- Map name input field -->
                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                        Map Name
                    </label>
                    <input
                        id="name"
                        v-model="formData.name"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter map name"
                    />
                    <div v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</div>
                    <div class="text-gray-500 text-sm mt-1">{{ formData.name.length }}/{{ MAP_NAME_MAX_LENGTH }}</div>
                </div>

                <!-- Map description textarea -->
                <div class="mb-6">
                    <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        v-model="formData.description"
                        rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter map description"
                    ></textarea>
                    <div v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</div>
                    <div class="text-gray-500 text-sm mt-1">
                        {{ formData.description.length }}/{{ MAP_DESCRIPTION_MAX_LENGTH }}
                    </div>
                </div>

                <!-- Action buttons container -->
                <div class="flex justify-end gap-3">
                    <button
                        type="button"
                        class="px-4 py-2 text-gray-600 hover:text-gray-800"
                        @click="closeDialog"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { updateGraphMetadata } from '~/utils/graphMetadataService';
import { MAP_NAME_MAX_LENGTH, MAP_NAME_MIN_LENGTH, MAP_DESCRIPTION_MAX_LENGTH } from '~/utils/constants';

const supabase = useSupabaseClient();

// Interface for form data structure
interface FormData {
    name: string;
    description: string;
}

interface GraphData {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    bookmarked: boolean;
}

// Props definition - controls dialog visibility
const props = defineProps<{
    modelValue: boolean;
    graph: GraphData; // Make graph required instead of optional
}>();

// Event emitters for v-model and form submission
const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    'submit': [data: GraphData];
}>();

// Reactive form data object
const formData = reactive<FormData>({
    name: props.graph?.name || '',
    description: props.graph?.description || ''
});

const errors = reactive({
    name: '',
    description: ''
});

const validateForm = (): boolean => {
    errors.name = '';
    errors.description = '';
    
    if (formData.name.length < MAP_NAME_MIN_LENGTH) {
        errors.name = `Name must be at least ${MAP_NAME_MIN_LENGTH} characters`;
        return false;
    }
    
    if (formData.name.length > MAP_NAME_MAX_LENGTH) {
        errors.name = `Name must be less than ${MAP_NAME_MAX_LENGTH} characters`;
        return false;
    }
    
    if (formData.description.length > MAP_DESCRIPTION_MAX_LENGTH) {
        errors.description = `Description must be less than ${MAP_DESCRIPTION_MAX_LENGTH} characters`;
        return false;
    }
    
    return true;
};

// Watch for changes in the graph prop to update form data
watch(() => props.graph, (newGraph) => {
    if (newGraph) {
        formData.name = newGraph.name;
        formData.description = newGraph.description;
    }
}, { immediate: true });

// Handles dialog close
const closeDialog = () => {
    emit('update:modelValue', false);
};

// Handles form submission
const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
        await updateGraphMetadata(supabase, {
            id: props.graph.id,
            ...formData
        });
        
        emit('submit', {
            ...props.graph,
            ...formData,
            updated_at: new Date().toISOString()
        });
        
        closeDialog();
    } catch (error) {
        console.error('Error updating graph:', error);
    }
};
</script>
