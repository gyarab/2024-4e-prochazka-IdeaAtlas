<script setup>
definePageMeta({
    middleware: ["auth"]
})
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

async function logout() {
    try {
        const {error} = await client.auth.signOut();
        if (error) {
            throw error;
        }
        console.log("Logout successful");
        router.push("/");
    } catch (error) {
        console.error("Error during logout:", error);
    }
}
</script>

<template>
<div class="profile container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Profile Page</h1>
    <div v-if="user" class="bg-white shadow-md rounded-lg p-6">
        <p class="text-lg"><strong>Email:</strong> {{ user.email }}</p> 
        <button @click="logout" class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">Logout</button>
    </div>
    <div v-else class="text-red-500">
        <p>Please log in</p>
    </div>
</div>
</template>
