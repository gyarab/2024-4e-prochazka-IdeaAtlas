<template>
    <div>
        <button @click="service.insertNodes(supabase, nodes)">Insert Nodes</button>
    </div>
    <div>
        <button @click="service.insertEdges(supabase, edges)">Insert Eges</button>
    </div>
</template>

<script setup>
import service from "~/utils/graphService";
import data from "../utils/data"

const nodes = data.nodes
const edges = data.edges

console.log(nodes)

const supabase = useSupabaseClient();
</script>