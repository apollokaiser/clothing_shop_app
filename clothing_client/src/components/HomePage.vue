<template>
    <div class="mt-5">
        <Carousel></Carousel>
        <div class="container mt-3 d-flex justify-content-center flex-column position-relative">
        <div class="attention-outfit-header">
            <span>Bạn có thích</span>
            <!-- <div class="see-more">
                <span>Xem tất cả</span>
                <i class="fa-solid fa-arrow-right ms-2"></i>
            </div> -->
        </div>
        <Attention v-if="attentionOutfit.length >0" :outfits="outfits"></Attention>
    </div>
        <LastestUpdatedOutfit :outfits="outfits"></LastestUpdatedOutfit>
    </div>
</template>

<script setup>
import Carousel from './Carousel.vue';
import { ref, onBeforeMount } from 'vue'
import Attention from "./Attention.vue"
import LastestUpdatedOutfit from './LastestUpdatedOutfit.vue';
import { init as getInit } from '@/data.function/getData';
import { useInitStore } from '@/stores/init.store';
import { storeToRefs } from 'pinia';
const init = useInitStore()
const {outfit} = storeToRefs(init);
const outfits = ref([])
const attentionOutfit = ref([])
onBeforeMount(() => {
   getInit(init.getAttenttion).then(response=>{
    if(!response) return;
    outfits.value = response.lastest_outfit;
    attentionOutfit.value = response.attention_outfit ? response.attention_outfit : [] ;
    outfit.value = attentionOutfit.value;
   })
})


</script>

<style scoped>
/* .content-container {
    width: 100%;
    min-height: 100vh;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
} */
.attention-outfit-header>span {
    font-size: 30px;
    font-weight: bold;
    text-transform: uppercase;
    font-family: "Lemonada", cursive;
    font-weight: 900;
    color: #333;
    text-align: center;
}

.attention-outfit-header .see-more {
    color: #ee58a6;
    font-style: italic;
    border-bottom: 1px solid #ee58a6;
    font-size: 20px;
    transition: all 0.2s ease;
}

.see-more span,
.see-more i {
    cursor: pointer;
}

.see-more:hover {
    transform: translateX(10px)
}
</style>