<script setup lang="js">
const prompt = ref('');
const idea = ref('');
const error = ref('');
const loading = ref(false);

const generateIdea = async () => {
  if (!prompt.value.trim()) {
    error.value = 'Please enter a prompt';
    return;
  }

  loading.value = true;
  error.value = '';
  
  try {
    const { data } = await useFetch('/api/generate-ideas', {
      method: 'POST',
      body: { prompt: prompt.value },
    });

    if (data.value?.error) {
      error.value = data.value.error;
    } else {
      idea.value = data.value;
    }
  } catch (err) {
    error.value = 'Failed to generate idea. Please try again.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>


<template>
  <div class="p-4">
    <input v-model="prompt" placeholder="Enter your idea prompt" class="border p-2 rounded w-full" />
    <button @click="generateIdea" :disabled="loading" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">
      Generate Idea
    </button>

    <div v-if="loading" class="mt-2">Generating...</div>
    <div v-if="idea" class="mt-2 text-green-600">Generated Idea: {{ idea }}</div>
    <div v-if="error" class="mt-2 text-red-600">Error: {{ error }}</div>
  </div>
</template>


<style scoped>
.about-page {
  padding: 2rem;
}

.content {
  margin-top: 1rem;
}
</style>
