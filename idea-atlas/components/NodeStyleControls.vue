<script setup lang="ts">
import { colorPalette } from '../config/colors';
import { NODE_MAX_SIZE, NODE_MIN_SIZE } from '~/config/constants';


const props = defineProps<{
    color: string;
    size: number;
}>();

const emit = defineEmits<{
    'update:color': [value: string];
    'update:size': [value: number];
}>();

const sizePresets = [20, 50, 75, 100];
</script>

<template>
    <!-- Color palette -->
    <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Color</label>
        <div class="flex flex-wrap items-center gap-2">
            <button v-for="colorOption in colorPalette" :key="colorOption" type="button"
                class="w-6 h-6 rounded-full border-2 cursor-pointer"
                :class="{ 'border-black': color === colorOption, 'border-transparent': color !== colorOption }"
                :style="{ backgroundColor: colorOption }" @click="emit('update:color', colorOption)" />
            <input type="color" :value="color" 
                @input="e => emit('update:color', (e.target as HTMLInputElement).value)"
                class="w-6 h-6 rounded cursor-pointer border-2 border-transparent hover:border-gray-300" />
        </div>
    </div>

    <!-- Size slider -->
    <div class="space-y-2">
        <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-gray-700">
                Size: {{ size }}
            </label>
            <div class="flex gap-2">
                <button v-for="preset in sizePresets" :key="preset"
                    class="px-2 py-1 text-sm rounded border"
                    :class="{ 'bg-gray-200 border-gray-400': size === preset, 'border-gray-300': size !== preset }"
                    @click="emit('update:size', preset)">
                    {{ preset }}
                </button>
            </div>
        </div>
        <input type="range" :value="size" @input="e => emit('update:size', +(e.target as HTMLInputElement).value)" 
            :min="NODE_MIN_SIZE" :max="NODE_MAX_SIZE" 
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
    </div>
</template>
