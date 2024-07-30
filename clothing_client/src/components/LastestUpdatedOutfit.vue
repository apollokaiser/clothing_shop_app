<template>
    <div class="container mt-5 d-flex justify-content-center flex-column position-relative">
        <div class="attention-outfit-header">
            <span>Trang phục mới cập nhật</span>
            <div class="see-more">
                <span>Khám phá ngay ?</span>
                <i class="fa-solid fa-arrow-right ms-2"></i>
            </div>
        </div>
        <div class="container content-container">
            <Outfit v-for="outfit in props.outfits" :key="outfit.maTrangPhuc" :outfit="outfit"></Outfit>
        </div>
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

.pa-4 {
    padding-left: 0 !important;
}
.content-container {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}
</style>