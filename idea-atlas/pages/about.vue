<script setup lang="js">
const features = [
  {
    title: 'Visual Mind Mapping',
    description: 'Create beautiful, interactive mind maps to organize your thoughts and ideas'
  },
  {
    title: 'Real-time Collaboration',
    description: 'Work together with your team in real-time, seeing changes as they happen'
  },
  {
    title: 'Smart Connections',
    description: 'Discover relationships between ideas with our intelligent linking system'
  },
  {
    title: 'Cross-Platform Access',
    description: 'Access your idea maps from any device, anywhere, anytime'
  }
]
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8 text-center">About IdeaAtlas</h1>
    <p class="mb-12 text-lg text-center max-w-3xl mx-auto text-gray-700">
      IdeaAtlas is a powerful tool for visualizing and connecting ideas, helping you organize thoughts and discover new connections in an intuitive way.
    </p>
    
    <div class="showcase-container mb-12">
      <ShowcaseMap />
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      <div v-for="(feature, index) in features" :key="index" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 class="text-xl font-semibold mb-3">{{ feature.title }}</h3>
        <p class="text-gray-600">{{ feature.description }}</p>
      </div>
    </div>

    <div class="bg-gray-50 p-8 rounded-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">Built with Modern Technology</h2>
      <div class="flex justify-center items-center gap-8">
        <div class="text-center">
          <a href="https://nuxt.com" target="_blank" rel="noopener noreferrer">
            <img src="/_nuxt/assets/images/nuxt.svg" alt="Nuxt.js" class="h-12 mb-2 mx-auto">
            <p class="font-medium">Nuxt 3</p>
          </a>
        </div>
        <div class="text-center">
          <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
            <img src="/_nuxt/assets/images/supabase.svg" alt="Supabase" class="h-12 mb-2 mx-auto">
            <p class="font-medium">Supabase</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.showcase-container {
  height: 600px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
</style>
