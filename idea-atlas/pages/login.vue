<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-50">
      <div class="card w-96">
        <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
        <form @submit.prevent="signIn">
          <!-- Email Input -->
          <div class="mb-4">
              <label for="email" class="block text-gray-700">Email: </label>
              <input class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" id="email" v-model="email" type="email" placeholder="Enter your email" required />
          </div>
          
          <!-- Password Input -->
          <div class="mb-4">
              <label for="password" class="block text-gray-700">Password: </label>
              <input class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" id="password" v-model="password" type="password" placeholder="Enter your password" required />
          </div>
          
          <!-- Submit Button -->
          <button type="submit" class="btn-primary w-full">Login</button>
        </form>
        
        <!-- Message Container -->
        <div class="mt-4">
            <div v-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
        </div>

        <!-- Redirect to register -->
        <div class="mt-6 text-center">
            <NuxtLink to="/register" class="text-blue-500 underline">Don't have an account yet? Register</NuxtLink>
        </div>
      </div>
    </div>
</template>

<script setup>
    const router = useRouter()
    const client = useSupabaseClient()
    
    const email = ref("")
    const password = ref(null)
    const errorMsg = ref(null)

    async function signIn(params) {
        try {
            const { error } = await client.auth.signInWithPassword({
                email: email.value,
                password: password.value
            })
            if(error) throw error
            router.push("/")
        } catch (error) {
            errorMsg.value = error.message
        }
    }
</script>

<style  scoped>
    
</style>