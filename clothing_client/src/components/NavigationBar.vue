<template>
    <div class="container mt-3 d-flex">
        <div class="logo">
            <img src="https://theme.hstatic.net/200000774833/1001119144/14/logo.png?v=405"
                title="Công ty trách nhiệm hữu hạn 1 thành viên" alt="">
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
    width: 60px;
    height: 60px;
}

.logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

</style>