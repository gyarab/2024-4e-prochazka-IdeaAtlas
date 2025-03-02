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
</script>

<template>
    <!-- Color palette -->
    <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Color</label>
        <div class="flex flex-wrap gap-2">
            <button v-for="colorOption in colorPalette" :key="colorOption" type="button"
                class="w-6 h-6 rounded-full border-2 cursor-pointer"
                :class="{ 'border-black': color === colorOption, 'border-transparent': color !== colorOption }"
                :style="{ backgroundColor: colorOption }" @click="emit('update:color', colorOption)" />
        </div>
    </div>

    <!-- Size slider -->
    <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
            Size: {{ size }}
        </label>
        <input type="range" :value="size" @input="e => emit('update:size', +(e.target as HTMLInputElement).value)" 
            :min="NODE_MIN_SIZE" :max="NODE_MAX_SIZE" 
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
    </div>
</template>
