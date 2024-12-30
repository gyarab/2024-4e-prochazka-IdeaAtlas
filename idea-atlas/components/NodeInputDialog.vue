<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  position: { x: number; y: number };
}>();

const emit = defineEmits(['close', 'submit']);

const nodeName = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    nodeName.value = '';
    setTimeout(() => {
      inputRef.value?.focus();
    }, 0);
  }
});

const handleSubmit = (e: Event) => {
  e.preventDefault();
  if (nodeName.value.trim()) {
    emit('submit', nodeName.value.trim());
    nodeName.value = '';
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    emit('close');
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" 
         class="fixed inset-0 pointer-events-none">
      <div class="absolute bg-white rounded-lg shadow-xl p-4 pointer-events-auto border-2 border-blue-200"
           :style="{
             left: `${position.x}px`,
             top: `${position.y}px`,
             transform: 'translate(-50%, -50%)',
             zIndex: 1000
           }">
        <form @submit="handleSubmit" class="w-64">
          <input
            ref="inputRef"
            v-model="nodeName"
            type="text"
            placeholder="Enter node name"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>
    </div>
  </Teleport>
</template>