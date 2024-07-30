<template>
   <div class="admin-staff-container">
    <div class="container-xl">
    <RouterView></RouterView>
    </div>
    </div>
</template>
<script setup>
import { RouterView } from 'vue-router';
</script>
<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-30%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.admin-staff-container {
    font-family: 'Varela Round', sans-serif;
    font-size: 13px;
    min-height: 100vh;
}
</style>