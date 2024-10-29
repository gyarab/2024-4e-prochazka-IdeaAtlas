<!-- maps/id jakekoliv id -->
 <template>
    <div>
        <p>Map with id {{ id }}</p>
    </div>
 </template>
 
 <script setup lang="ts">
    const {id} = useRoute().params;
    definePageMeta({
        layout: 'maps'
    })
 </script>
 
 <style scoped>
 
 </style>