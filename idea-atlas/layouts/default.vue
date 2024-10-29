<template>
    <div>
        <header>
            <nav>
                <NuxtLink to="/">Idea Atlas</NuxtLink>
                <ul>
                    <li><NuxtLink to="/">Home</NuxtLink></li>
                    <li><NuxtLink to="/about">About</NuxtLink></li>
                    <li><NuxtLink to="/maps">Maps</NuxtLink></li>
                </ul>
            </nav>
        </header>
        <div>
        <slot /> <!-- page content -->
        </div>
    </div>

</template>
<style scoped>
    
</style>