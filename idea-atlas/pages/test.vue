<template>
    <div>
        <button @click="service.insertNodes(supabase, nodes)">Insert Nodes</button>
    </div>
    <div>
        <button @click="service.insertEdges(supabase, edges)">Insert Eges</button>
    </div>
    <div>
        <button @click="service.insertLayouts(supabase, layouts)">Insert Layouts</button>
    </div>
</template>

<script setup>
import service from "~/utils/graphService";
import data from "../utils/data"

const nodes = data.nodes
const edges = data.edges
const layouts = data.layouts

console.log(nodes)

const supabase = useSupabaseClient();
</script>