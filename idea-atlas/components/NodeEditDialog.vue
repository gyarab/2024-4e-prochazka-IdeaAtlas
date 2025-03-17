<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useDraggable } from '~/composables/useDraggable';

// Props definition for dialog visibility and position
const props = defineProps<{
    isOpen: boolean;
    position: { x: number; y: number };
    currentName: string;
    currentColor: string;
    currentSize: number;
}>();

// Event emitters for dialog actions
const emit = defineEmits(['close', 'submit']);

// Reactive refs for input management
const nodeName = ref('');
const inputRef = ref<HTMLInputElement | null>(null);
const errorMessage = ref('');  // Add this line

// Add new refs for color and size
const nodeColor = ref(props.currentColor);
const nodeSize = ref(props.currentSize);

// Watch for dialog open state to reset and focus input
watch(() => props.isOpen, (newValue) => {
    if (newValue) {
        nodeName.value = props.currentName;
        nodeColor.value = props.currentColor;
        nodeSize.value = props.currentSize;
        // Using setTimeout to ensure DOM is updated before focusing
        setTimeout(() => {
            inputRef.value?.focus();
        }, 0);
    }
});

// Form submission handler
const handleSubmit = (e: Event) => {
    e.preventDefault();
    errorMessage.value = '';  // Reset error message
    
    if (!nodeName.value.trim()) {
        errorMessage.value = 'Node name is required';
        return;
    }
    
    emit('submit', {
        name: nodeName.value.trim(),
        color: nodeColor.value,
        size: nodeSize.value
    });
    nodeName.value = '';
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

const { startDrag } = useDraggable();
const dialogRef = ref<HTMLDivElement | null>(null);
</script>

<template>
    <!-- Teleport allows to move the component arround -->
    <Teleport to="body">
        <!-- Modal backdrop and container -->
        <div v-if="isOpen" class="fixed inset-0 pointer-events-none z-40">
            <!-- Dialog box with positioning -->
            <div 
                ref="dialogRef"
                class="absolute bg-white rounded-lg shadow-xl pointer-events-auto border-2 border-blue-200" 
                :style="{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000
                }"
            >
                <!-- Add draggable header -->
                <div 
                    class="p-2 bg-gray-100 cursor-move rounded-t-lg border-b flex justify-between items-center"
                    @mousedown="(e) => dialogRef && startDrag(e, dialogRef)"
                >
                    <span class="text-sm font-semibold">Edit Node</span>
                </div>
                <!-- Existing form wrapped in padding -->
                <div class="p-4">
                    <form @submit="handleSubmit" class="w-64 space-y-4">
                        <div>
                            <input ref="inputRef" v-model="nodeName" type="text" placeholder="Enter node name"
                                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <div v-if="errorMessage" class="text-red-500 text-sm mt-1">{{ errorMessage }}</div>
                        </div>
                        
                        <NodeStyleControls
                            v-model:color="nodeColor"
                            v-model:size="nodeSize"
                        />

                        <!-- Submit button -->
                        <button
                            type="submit"
                            class="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Apply Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </Teleport>
</template>