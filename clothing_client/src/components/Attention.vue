<template>
        <div class="content-container">
            <v-sheet max-width="100%">
                <v-slide-group class="pa-4" show-arrows>
                    <v-slide-group-item v-for="outfit in props.outfits" :key="outfit">
                        <Outfit :outfit="outfit"></Outfit>
                    </v-slide-group-item>
                </v-slide-group>
            </v-sheet>
        </div>
</template>
<script setup>
import Outfit from './Outfit.vue';
const props = defineProps({
    outfits: {
        type: Object,
        required: true
    }
})
</script>
<style scoped>
.pa-4 {
    padding-left: 0 !important;
}
.content-container {
    margin-left: -10px;
}
</style>