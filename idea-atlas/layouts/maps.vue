<template>
    <div>
        <header class="shadow-sm bg-white">
            <nav class="container mx-auto p-4 flex justify-between">
                <NuxtLink to="/" class="font-bold">Idea Atlas</NuxtLink>
                <ul class="flex gap-4">
                    <li><NuxtLink to="/">Home</NuxtLink></li>
                    <li><NuxtLink to="/about">About</NuxtLink></li>
                    <!-- TODO it should not be seen until log in -->
                    <li><NuxtLink to="/maps" class="btn">Maps</NuxtLink></li>
                    <!-- TODO it should not be seen until log in -->
                    <li><NuxtLink to="/profile" class="btn">profile</NuxtLink></li>
                </ul>
            </nav>
        </header>
        <!-- "container mx-auto p-4" -->
        <div>
        <slot /> <!-- page content -->
        </div>
    </div>

</template>
<style scoped>
    
</style>