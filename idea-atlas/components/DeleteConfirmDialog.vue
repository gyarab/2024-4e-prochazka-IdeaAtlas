<template>
    <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 class="text-xl font-semibold mb-4 text-gray-900">Delete Map</h2>
            
            <div class="mb-6">
                <p class="text-gray-600">
                    Are you sure you want to delete this map? This action cannot be undone.
                </p>
            </div>

            <div class="flex justify-end gap-3">
                <button
                    type="button"
                    class="px-4 py-2 text-gray-600 hover:text-gray-800 rounded"
                    @click="$emit('update:modelValue', false)"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    @click="handleConfirm"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: boolean
}>();

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'confirm': []
}>();

const handleConfirm = () => {
    emit('confirm');
    emit('update:modelValue', false);
};
</script>
