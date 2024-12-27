<template>
    <div>

    </div>
</template>

<script setup>
import insertNodes from "~/utils/graphService";
import data from "../utils/data"

const nodes = data.nodes

console.log(nodes)

const supabase = useSupabaseClient();

insertNodes(supabase, nodes);


</script>