<script setup lang="js">

</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-6">About IdeaAtlas</h1>
    <p class="mb-6">
      IdeaAtlas is a powerful tool for visualizing and connecting ideas. Below is a demonstration of how ideas can be connected:
    </p>
    
    <div class="showcase-container mb-6">
      <ShowcaseMap />
    </div>

    <p class="mt-6">
      Start creating your own idea maps today and discover new connections between your thoughts.
    </p>
  </div>
</template>

<style scoped>
.showcase-container {
  height: 600px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}
</style>
