<script setup lang="ts">
import * as vNG from "v-network-graph"
import { reactive } from "vue"
import data from "./data"

// Define the configurations
const configs = reactive(
    vNG.defineConfigs({
        view: {
                        scalingObjects: true, // Enable scaling objects, so the nodes and edges will be scaled when zooming
                  minZoomLevel: 0.1,
                  maxZoomLevel: 16,
                  
        },
    })
);
</script>

<template>
        <v-network-graph
            class="fixed inset-0 w-screen h-screen"
            :nodes="data.nodes"
            :edges="data.edges"
            :layouts="data.layouts"
            :configs="configs"
        />
</template>

<style>
</style>