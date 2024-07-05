<template>
    <div class="admin-page-container">
       <Sidebar/>
       <div class="admin-content-container">
        <Header></Header>
        <RouterView></RouterView>
       </div>
    </div>
</template>

<script setup>
import Header from "@/components/Admin/Header.vue"
import Sidebar from "./Sidebar.vue";
import { RouterView } from "vue-router";
</script>
<style lang="css" scoped>
.admin-page-container {
    width: 100%;
    height: 100vh;
    display: flex;
}
.admin-content-container {
    padding-left:270px;
    width: 100%;
}
</style>