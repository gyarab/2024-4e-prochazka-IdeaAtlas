<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

// Props definition for dialog visibility and position
const props = defineProps<{
    isOpen: boolean;
    position: { x: number; y: number };
}>();

// Event emitters for dialog actions
const emit = defineEmits(['close', 'submit']);

// Reactive refs for input management
const nodeName = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

// Add new refs for color and size
const nodeColor = ref('#3498db'); // Default blue color
const nodeSize = ref(30); // Default size

// Color palette options
const colorPalette = [
    '#3498db', // Blue
    '#e74c3c', // Red
    '#2ecc71', // Green
    '#f1c40f', // Yellow
    '#9b59b6', // Purple
    '#e67e22', // Orange
    '#1abc9c', // Turquoise
    '#34495e', // Dark Blue
    '#7f8c8d', // Gray
    '#2c3e50', // Navy Blue
];

// Watch for dialog open state to reset and focus input
watch(() => props.isOpen, (newValue) => {
    if (newValue) {
        nodeName.value = '';
        nodeColor.value = '#3498db'; // Reset to default color
        nodeSize.value = 30; // Reset to default size
        setTimeout(() => {
            inputRef.value?.focus();
        }, 0);
    }
});

// Form submission handler
const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (nodeName.value.trim()) {
        emit('submit', {
            name: nodeName.value.trim(),
            color: nodeColor.value,
            size: nodeSize.value
        });
        nodeName.value = '';
    }
};

// Global escape key handler for closing dialog
const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        e.preventDefault();
        emit('close');
    }
};

// Lifecycle hooks for event listener management
onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <Teleport to="body">
        <!-- Modal backdrop and container -->
        <div v-if="isOpen" class="fixed inset-0 pointer-events-none z-40">
            <!-- Dialog box with positioning -->
            <div class="absolute bg-white rounded-lg shadow-xl p-4 pointer-events-auto border-2 border-blue-200" :style="{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 1000
            }">
                <form @submit="handleSubmit" class="w-64 space-y-4">
                    <!-- Name input -->
                    <input ref="inputRef" v-model="nodeName" type="text" placeholder="Enter node name"
                        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    
                    <!-- Color palette -->
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">Color</label>
                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="color in colorPalette"
                                :key="color"
                                type="button"
                                class="w-6 h-6 rounded-full border-2 cursor-pointer"
                                :class="{ 'border-black': nodeColor === color, 'border-transparent': nodeColor !== color }"
                                :style="{ backgroundColor: color }"
                                @click="nodeColor = color"
                            ></button>
                        </div>
                    </div>

                    <!-- Size slider -->
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">
                            Size: {{ nodeSize }}
                        </label>
                        <input
                            type="range"
                            v-model="nodeSize"
                            min="1"
                            max="100"
                            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <!-- Submit button -->
                    <button
                        type="submit"
                        class="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Create Node
                    </button>
                </form>
            </div>
        </div>
    </Teleport>
</template>