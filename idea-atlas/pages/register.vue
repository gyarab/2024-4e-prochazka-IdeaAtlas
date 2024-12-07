<script setup>
const client = useSupaBaseAuthClient();
const email = ref('');
const password = ref(null);
const errorMsg = ref(null);
const successMsg = ref(null);

async function signUp() {
    try {
        const{data,errors} = await client.auth.signUp({
            email: email.value,
            password: password.value
        });
        if (errors) {
            throw new Error(errors[0].message);
        }
        successMsg.value = 'Account created successfully';
    }catch (error) {
        errorMsg.value = error.message;
    }
    
}
</script>
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
            <form @submit.prevent="signUp">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
                    <input v-model="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" required>
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
                    <input v-model="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" required>
                </div>
                <div class="flex items-center justify-between">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Register</button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>