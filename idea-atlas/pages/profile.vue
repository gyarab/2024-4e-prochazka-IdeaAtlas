<script setup>
const user = useSupabaseUser();
const router = useRouter();

async function logout() {
    try {
        const {error} = await supabase.auth.signOut();
        if (error) {
            throw error;
        }
        router.push("/login");
    } catch (error) {
        console.error("Error during logout:", error);
    }
}
</script>

<template>
<div class="profile">
    <h1>Profile Page</h1>
    <div v-if="user">
        <!-- The strong element represents strong importance, seriousness, or urgency for its contents. -->
        <p><strong>Email:</strong> {{ user.email }}</p> 
        <button @click="logout">Logout</button>
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
</div>
</template>