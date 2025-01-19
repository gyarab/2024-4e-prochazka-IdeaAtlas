<template>
    <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <h2 class="text-xl font-semibold mb-2">{{ network.name }}</h2>
        <div class="flex justify-between text-sm text-gray-500">
            <span>Created: {{ formatDate(network.created_at) }}</span>
        </div>
        <NuxtLink :to="`/maps/${network.id}`" 
                 class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Open Map
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
interface Props {
    network: {
        id: string;
        name: string;
        created_at: string;
    }
}

const props = defineProps<Props>();

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
};
</script>

<style scoped>

</style>