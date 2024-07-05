<template>
    <div class="container mt-5">
        <div class="content-container">
            <Outfit v-for="outfit in outfits" :key="outfit.maTrangPhuc" :outfit="outfit"></Outfit>
        </div>
    </div>
</template>

<script setup>
import Outfit from './Outfit.vue';
import axios from '@/config/axios.js';
import { ref, onBeforeMount, computed } from 'vue'
const outfits = ref("")
onBeforeMount(() => {
    axios.get("/trang-phuc/danh-sach")
        .then((response) => {
            outfits.value = response.data.data.trangphucs;
        })
        .catch((error) => {
            console.log(error);
        }); //
})


</script>

<style>
.content-container {
    width: 100%;
    /* height: 100%; */
    min-height: 100vh;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
</style>