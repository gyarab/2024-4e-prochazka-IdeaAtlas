<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
            <!-- Email Input -->
            <div class="mb-4">
                <label for="email" class="block text-gray-700">Email:</label>
                <input class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" id="email" v-model="email" type="email" placeholder="Enter your email" />
            </div>
            
            <!-- Password Input -->
            <div class="mb-4">
                <label for="password" class="block text-gray-700">Password:</label>
                <input class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" id="password" v-model="password" type="password" placeholder="Enter your password" />
            </div>
            
            <!-- Submit Button -->
            <button @click="signUp" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Register</button>

            <!-- Message Container -->
            <div class="mt-4">
                <div v-if="successMsg" class="text-green-500">{{ successMsg }}</div>
                <div v-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
            </div>

            <!-- Redirect to login -->
            <div class="mt-6 text-center">
                <NuxtLink to="/login" class="text-blue-500 underline">Already have an account? Login</NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
    const client = useSupabaseClient()
    const email = ref("")
    const password = ref(null)
    const errorMsg = ref(null)
    const successMsg = ref(null)

    async function signUp(params) {
        try{
            const { data, error } = await client.auth.signUp({
                email: email.value,
                password: password.value,
            })
        
            if(error) throw error
        successMsg.value = "check you email inbox for verification"
        errorMsg.value = null
        }
        catch (error) {
            errorMsg.value = error.message
            successMsg.value = null
        }
    }
</script>

<style  scoped>
    
</style>