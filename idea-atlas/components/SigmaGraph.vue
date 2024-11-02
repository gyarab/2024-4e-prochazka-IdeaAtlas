<template>
  <div ref="sigmaContainer" id="sigma-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const sigmaContainer = ref<HTMLDivElement | null>(null);

onMounted(() => {
    // Ensure the code runs only in the browser environment
    if (typeof window !== 'undefined') {
        // Dynamically import the Sigma library
        import('sigma').then(({ default: Sigma }) => {
            // Dynamically import the Graphology library
            import('graphology').then(({ default: Graph }) => {
                // Dynamically import the Graphology layout library
                import('graphology-layout').then(({ circular }) => {
                    // Check if the sigmaContainer ref is set
                    if (sigmaContainer.value) {
                        // Create a new graph instance
                        const graph = new Graph();

                        // Add nodes to the graph with labels, positions, sizes, and colors
                        graph.addNode('n1', { label: 'Node 1', x: 0, y: 0, size: 10, color: '#f00' });
                        graph.addNode('n2', { label: 'Node 2', x: 1, y: 1, size: 10, color: '#0f0' });
                        graph.addNode('n3', { label: 'Node 3', x: 2, y: 2, size: 10, color: '#00f' });
                        graph.addNode('n4', { label: 'Node 4', x: 3, y: 3, size: 10, color: '#ff0' });
                        graph.addNode('n5', { label: 'Node 5', x: 4, y: 4, size: 10, color: '#0ff' });

                        // Add edges between nodes
                        graph.addEdge('n1', 'n2');
                        graph.addEdge('n1', 'n3');
                        graph.addEdge('n2', 'n4');
                        graph.addEdge('n2', 'n5');
                        graph.addEdge('n3', 'n3');

                        // Apply a circular layout to the graph
                        circular.assign(graph);

                        // Initialize Sigma with the graph and container
                        new Sigma(graph, sigmaContainer.value);
                    }
                });
            });
        });
    }
});
</script>

<style scoped>
#sigma-container {
  width: 600px;
  height: 400px;
  border: 1px solid lightgray;
}
</style>
