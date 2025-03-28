<script setup lang="ts">
import { keyboardShortcuts } from '../config/keyboardShortcuts';

const props = defineProps<{
  isOpen: boolean;
}>();

defineEmits(['close']);

const shortcuts = Object.entries(keyboardShortcuts)
  .map(([key, shortcut]) => {
    const modifiers = [];
    if (shortcut.ctrlKey) modifiers.push('Ctrl');
    if (shortcut.shiftKey) modifiers.push('Shift');
    
    const displayKey = shortcut.key === ' ' ? 'Space' : shortcut.key;
    const keyCombo = [...modifiers, displayKey].join(' + ');
    
    return {
      combos: shortcut.special 
        ? [keyCombo, shortcut.special]
        : [keyCombo],
      description: shortcut.description
    };
  })
  .sort((a, b) => a.description.localeCompare(b.description));
</script>

<template>
  <div v-if="isOpen" class="fixed top-40 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md z-50 border border-gray-200">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">Keyboard Shortcuts</h2>
      <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="space-y-2">
      <div v-for="(shortcut, index) in shortcuts" :key="index" 
           class="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
        <span class="text-sm text-gray-600">{{ shortcut.description }}</span>
        <div class="flex items-center gap-2">
          <template v-for="(combo, comboIndex) in shortcut.combos" :key="comboIndex">
            <kbd class="px-2 py-1 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded">
              {{ combo }}
            </kbd>
            <span v-if="comboIndex < shortcut.combos.length - 1" class="text-gray-500">or</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
