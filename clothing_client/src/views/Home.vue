<template>
  <div class="body-container">
    <!--Header-->
    <Header></Header>
    <!-- Navigation -->
    <NavigationBar :categories="categories"></NavigationBar>
    <!--main-->
    <RouterView v-slot="{ Component }">
      <transition :name="route.meta.transition || slide" mode="out-in">
        <component :is="Component" :key="$route.path"></component>
      </transition>
    </RouterView>
    <!--footer-->
    <Footer></Footer>
    <!--login popup-->
    <Suspense>
      <template #default>
        <transition name="slide-fade" mode="out-in" :duration="{ enter: 550, leave: 200 }">
          <component :is="loginPopup" v-if="!isLoggedIn && loginRequest"></component>
        </transition>
      </template>
      <template #fallback>
        <Loading />
      </template>
    </Suspense>
    <transition name="slide-fade">
      <Notification v-if="showMsg">
        <template v-slot:title>
          <span>Thành công</span>
        </template>
        <template v-slot:message>
          <span>Đăng nhập thành công</span>
        </template>
      </Notification>
    </transition>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onBeforeMount, ref, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import Header from "@/components/Header.vue"
import Footer from '@/components/Footer.vue'
import Loading from '@/components/Loading.vue';
import NavigationBar from "@/components/NavigationBar.vue"
import Notification from '@/components/Notification.vue';

import { ApplicationStarter } from '@/data.function/getData.js'
import { authStore } from '@/stores/user.store'
import { useResource } from '@/stores/resource.store';
const auth = authStore();
const resource = useResource();
const { isLoggedIn, loginRequest, showMsg } = storeToRefs(auth)
const loginPopup = defineAsyncComponent({
  loader: () => import("@/components/authentication/Login.vue"),
  loadingComponent: () => import("@/components/Loading.vue"),
  delay: 1000,
  timeout: 3000
})
const route = useRoute();
const categories = ref([])
const outfits = ref([])
onBeforeMount(() => {
  ApplicationStarter().then((result) => {
    categories.value = result?.categoryResource;
    outfits.value = result?.outfitResource;
    resource.setCategory(result?.categoryResource)
  })
})

</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>