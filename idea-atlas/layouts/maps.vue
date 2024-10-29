<template>
    <div>
        <header class="shadow-sm bg-white">
            <nav class="container mx-auto p-4">
                <NuxtLink to="/maps" class="font-bold">Maps</NuxtLink>
            </nav>
        </header>
        <div class="container mx-auto p-4">
            <slot /> <!-- page content -->
        </div>
        <footer class="container mx-auto p-4 flex justify-between border-t-2">
            <ul class="flex gap-4">
                <li>
                    <NuxtLink to="/">Home</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/about">About</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/maps">Maps</NuxtLink>
                </li>
            </ul>
        </footer>
    </div>
</template>

<style scoped></style>
