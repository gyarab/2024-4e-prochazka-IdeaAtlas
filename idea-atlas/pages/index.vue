<template>
    <div class="about-container">
      <div class="hero-section">
        <h1 class="animated-title">
          <span class="text-gradient">Idea</span>
          <span class="text-separator">-</span>
          <span class="text-gradient">Atlas</span>
        </h1>
        <p class="subtitle">simple mind-map tool</p>
      </div>
      <div class="content-section">
        <p class="description">Created by Vítězsav Procházka 4.E 2024/2025</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // No script needed for this animation
  </script>
  
  <style scoped>
  
  .hero-section {
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  
  .animated-title {
    font-size: 5rem;
    font-weight: 800;
    display: flex;
    gap: 0.5rem;
    animation: float 6s ease-in-out infinite;
  }
  
  .text-gradient {
    background: linear-gradient(45deg, #2371ed, #60a5fa);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 30px rgba(59, 131, 246, 0.628);
    transition: all 0.3s ease;
  }
  
  .text-gradient:hover {
    transform: scale(1.1);
    text-shadow: 0 0 50px rgba(59, 131, 246, 0.847);
  }
  
  .text-separator {
    color: #3b82f6;
  }
  
  .subtitle {
    font-size: 1.5rem;
    margin-top: 2rem;
    opacity: 0;
    animation: fadeIn 1s ease-out forwards 1s;
  }
  
  .content-section {
    padding: 2rem;
    text-align: center;
  }
  
  .description {
    font-size: 1.2rem;
    opacity: 0;
    animation: slideUp 1s ease-out forwards 1.5s;
  }
  
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>