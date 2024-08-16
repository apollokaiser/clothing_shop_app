<template>
  <div class="body-container">
    <!--Header-->
    <Header></Header>
    <!-- Navigation -->
    <NavigationBar :categories="categories"></NavigationBar>
    <!--main-->
    <!-- <RouterView v-slot="{ Component }">
      <transition :name="route.meta.transition || 'slide'" mode="out-in">
        <component :is="Component" :key="$route.path"></component>
      </transition>
    </RouterView> -->
    <RouterView/>
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
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { RouterView } from 'vue-router'
import { onBeforeMount, ref, defineAsyncComponent, watch } from 'vue'
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import Header from "@/components/Header.vue"
import Footer from '@/components/Footer.vue'
import Loading from '@/components/Loading.vue';
import NavigationBar from "@/components/NavigationBar.vue"
import { getCategory } from '@/data.function/getData.js'
import { authStore } from '@/stores/user.store'
import { useResource } from '@/stores/resource.store';
const resource = useResource();
const auth = authStore();
const { isLoggedIn, loginRequest, showMsg } = storeToRefs(auth)
const loginPopup = defineAsyncComponent({
  loader: () => import("@/components/authentication/Login.vue"),
  loadingComponent: () => import("@/components/Loading.vue"),
  delay: 1000,
  timeout: 3000
})
const route = useRoute();
const categories = ref([])
onBeforeMount(() => {
 getCategory().then(response =>{
    if(!response) alert("Hệ thống sẽ bắt đầu trong giây lát ..")
    else {
   categories.value = response;
   resource.setCategory(response)
  }
 })
})
watch(showMsg, value =>{
  if(value)
         Swal.fire({
            title: 'Đăng nhập thành thành công',
            icon: 'success',
            confirmButtonText: 'OK',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'button-swal',
            }
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
</style>