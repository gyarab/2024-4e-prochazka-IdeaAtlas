<!-- maps/id jakekoliv id -->
 <template>
    <div>
        <p>Map with id {{ id }}</p>
    </div>
 </template>
 
 <script setup lang="ts">
    const {id} = useRoute().params;
 </script>
 
 <style scoped>
 
 </style>