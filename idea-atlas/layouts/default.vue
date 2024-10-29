<template>
    <div>
        <header class="shadow-sm bg-white">
            <nav class="container mx-auto p-4 flex justify-between">
                <NuxtLink to="/" class="font-bold">Idea Atlas</NuxtLink>
                <ul class="flex gap-4">
                    <li><NuxtLink to="/">Home</NuxtLink></li>
                    <li><NuxtLink to="/about">About</NuxtLink></li>
                    <li><NuxtLink to="/maps" class="btn">Maps</NuxtLink></li>
                </ul>
            </nav>
        </header>
        <div class="container mx-auto p-4">
        <slot /> <!-- page content -->
        </div>
    </div>

</template>
<style scoped>
    
</style>