<template>
    <div class="auth-container">
        <RouterView></RouterView>
    </div>

</template>
<style scoped>
.auth-container{
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
    overflow: hidden;
}
</style>
<script setup>
import { RouterView } from 'vue-router';
</script>