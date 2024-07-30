<template>
  <div class="outfit-admin-container container">
    <RouterView v-slot="{ Component }">
      <transition :name="route.meta.transition || slide" mode="out-in">
        <component :is="Component" :key="$route.path"></component>
      </transition>
    </RouterView>
  </div>
</template>
<script setup>
import { RouterView } from 'vue-router';
import { useRoute } from 'vue-router';
const route = useRoute();
</script>
<style scoped>
.outfit-admin-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>

