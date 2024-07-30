<template>
    <div class="container mt-3 d-flex align-items-center">
        <div class="logo">
            <img src="https://firebasestorage.googleapis.com/v0/b/clothing-shop-427915.appspot.com/o/_65c48431-eb4b-42a8-b416-a7b4090000b1-removebg-preview.png?alt=media&token=1f205c4d-da69-41a7-9aed-53f27cd92251"
                title="Công ty trách nhiệm hữu hạn 1 thành viên" alt="">
                <span class="font-effect-fire">Ánh Dương Store</span>
        </div>
        <div class="header-wrap-menu">
            <div class="navbar">
                <ul class="menu">
                    <MenuItem v-for="item in initialNav" :item="item" :key="item.id">
                    </MenuItem>
                    <MenuItem v-for="c in props.categories" :item="c" :key="c.maLoai">
                    </MenuItem>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import MenuItem from "@/components/MenuItem.vue"
import Link from './Link.vue';

const initialNav = ref([
    {   initial:true, 
        maLoai: "1",
        tenLoai: "Trang chủ",
        slug: "/",
        children: [
            {
                maLoai: "2",
                tenLoai: "Quy định thuê trang phục",
                slug: "quy-dinh",
                children: [
                    {
                        maLoai: "3",
                        tenLoai: "Quy dinh 1",
                        slug: "quy-dinh-1",
                        children: []
                    },
                    {
                        maLoai: "4",
                        tenLoai: "Quy dinh 2",
                        slug: "quy-dinh-2",
                        children: []
                    },
                ]
            },
            {
                maLoai: "5",
                tenLoai: "Blog",
                slug: "blog",
                children: []
            },
            {
                maLoai: "6",
                tenLoai: "Liên hệ",
                slug: "lien-he",
                children: []
            }
        ]
    }
])
const props = defineProps({
    categories: {
        type: Array,
        required: true
    }
})
</script>

<style scoped>
.logo {
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.logo span{
    font-size: 12px;
    font-weight: bold;
    margin-top: 5px;
}
.logo>span.font-effect-fire {
    text-shadow: 0 -0.05em 0.2em #FFF, 0.01em -0.02em 0.15em #FE0, 0.01em -0.05em 0.15em #FC0, 0.02em -0.15em 0.2em #F90, 0.04em -0.20em 0.3em #F70, 0.05em -0.25em 0.4em #F70, 0.06em -0.2em 0.9em #F50, 0.1em -0.1em 1.0em #F40;
} 

.logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

</style>