<script setup lang="ts">
import * as vNG from "v-network-graph"
import { reactive } from "vue"
//import data from "../utils/data"
import service from "../utils/graphService"

const supabase = useSupabaseClient()

const data = service.fetchGraph(supabase)
console.log(data)
// Define the configurations
const configs = reactive(
  vNG.defineConfigs({
    view: {
      grid: {
        visible: true,
        interval: 10,
        thickIncrements: 5,
        line: {
          color: "#e0e0e0",
          width: 1,
          dasharray: 1,
        },
        thick: {
          color: "#cccccc",
          width: 1,
          dasharray: 0,
        },
      },
      layoutHandler: new vNG.GridLayout({ grid: 10 }),
      scalingObjects: true, // Enable scaling objects, so the nodes and edges will be scaled when zooming
                  minZoomLevel: 0.1,
                  maxZoomLevel: 16,
    },
  })
)
</script>

<template>
    <client-only>
        <v-network-graph
            class="fixed inset-0 w-screen h-screen"
            :nodes="data.nodes"
            :edges="data.edges"
            :layouts="data.layouts"
            :configs="configs"
        />
    </client-only>
</template>

<style>
</style>