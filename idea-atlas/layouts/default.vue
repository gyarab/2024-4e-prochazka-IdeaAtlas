<template>
    <div>
        <header class="shadow-sm bg-white fixed top-0 left-0 right-0 z-50">
            <nav class="container mx-auto p-4 flex justify-between items-center">
                <NuxtLink to="/" class="font-bold text-xl text-primary hover:text-primary-hover">Idea Atlas</NuxtLink>
                <ul class="flex gap-6 items-center">
                    <li><NuxtLink to="/" class="text-text-light hover:text-text-color">Home</NuxtLink></li>
                    <li><NuxtLink to="/about" class="text-text-light hover:text-text-color">About</NuxtLink></li>
                    <li><NuxtLink to="/maps" class="btn-primary">Maps</NuxtLink></li>
                    <li><NuxtLink to="/profile" class="btn-primary">{{ userEmail || 'Profile' }}</NuxtLink></li>
                </ul>
            </nav>
        </header>
        <div class="pt-16 min-h-screen bg-secondary-bg">
            <slot />
        </div>
    </div>
</template>
<script setup lang="ts">
const supabase = useSupabaseClient();
const userEmail = ref('');

// Function to update user email
const updateUserEmail = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    userEmail.value = user?.email || '';
};

onMounted(async () => {
    // Initial email check
    await updateUserEmail();
    
    // Listen for auth state changes
    supabase.auth.onAuthStateChange((_event, _session) => {
        updateUserEmail();
    });
});
</script>
<style scoped>
    
</style>