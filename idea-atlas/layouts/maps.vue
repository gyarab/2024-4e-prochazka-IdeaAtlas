<template>
    <div>
        <header>
            <nav>
                <NuxtLink to="/maps">Maps</NuxtLink>
            </nav>
        </header>
        <div>
            <slot /> <!-- page content -->
        </div>
        <footer>
            <ul>
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