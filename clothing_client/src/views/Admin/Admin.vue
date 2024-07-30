<template>
    <div class="admin-page-container">
        <Header></Header>
       <div class="admin-content-container container">
        <RouterView v-slot="{ Component }">
      <transition :name="route.meta.transition || slide" mode="out-in">
        <component :is="Component" :key="$route.path"></component>
      </transition>
    </RouterView>
       </div>
    </div>
</template>

<script setup>
import Header from "@/components/Admin/Header.vue"
import { RouterView } from "vue-router";
import { useRoute } from "vue-router";
const route = useRoute();
</script>
<style lang="css" scoped>
.admin-page-container {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    display: flex;
    background-color: #4e657a;
    flex-direction: column;
    overflow-x: hidden;
}
.admin-content-container {
    width: 100%;
}
@media (min-width: 1400px) {
    .container, .container-lg, .container-md, .container-sm, .container-xl, .container-xxl {
        max-width: 1140px;
    }
}
</style>