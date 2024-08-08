<template>
  <div class="header-container">
    <!-- <div class="topbar text-center py-1">{{ slogan[index] }}</div> -->
    <div class="web-info py-1 mb-4">
      <div class="contact-info ms-5">
        <span id="hotline">0329026130</span>
        <span class="mx-4">|</span>
        <span id="time">Mở cửa vào lúc 8h - 20h</span>
      </div>
      <div class="contact-social-account me-5">
        <i class="fa fa-facebook" aria-hidden="true"></i>
        <span class="mx-4">|</span>
        <i class="fa fa-instagram" aria-hidden="true"></i>
      </div>
    </div>
    <div
      class="main-header container d-flex justify-content-between align-items-center"
    >
      <Address />
      <div
        class="header-action col-sm-5 d-flex justify-content-between align-items-center"
      >
        <div class="search-bar me-3">
          <div class="search-container">
        <input checked="" class="search-checkbox" type="checkbox"> 
        <div class="mainbox">
            <div class="iconContainer">
                <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg" class="search_icon"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg>
            </div>
         <input v-model="search" class="search_input" placeholder="search" type="text" v-on:keyup.enter="searchOutfit">
        </div>
    </div>
        </div>
        <div
          class="account-container p-1 d-flex justify-content-between align-items-center"
        >
          <span class="account-icon"
            ><i class="fa fa-user" aria-hidden="true"></i
          ></span>
          <div @click="userAccess">
            <div
              v-if="!isLogin"
              class="d-flex flex-column justify-content-center align-items-center"
            >
              <span class="fst-italic">Đăng nhập/Đăng ký</span>
              <span>Tài khoản</span>
            </div>
            <div v-if="isLogin" class="user-account">
              <span class="fst-italic">{{ user.email }}</span>
              <span>{{ user.name || "Chưa cập nhật" }}</span>
            </div>
          </div>
          <div v-if="isLogin" class="account-action">
            <Link
              :to="{
                name: 'account_profile',
                params: { uid: user.uid, username: convertToSlug(user.name) ||'khach-hang' },
              }"
              ><span>Tài khoản</span></Link
            >
            <Link v-if="auth.isAdmin" to="/chuyen-doi-tai-khoan" ><span>Quản trị</span></Link>
            <span
              @click="logOut"
              class="d-flex justify-content-between align-items-center"
              >Đăng xuất <i class="fa fa-sign-out" aria-hidden="true"></i
            ></span>
          </div>
        </div>
        <div
          class="cart-container p-1 d-flex justify-content-between align-items-center"
        >
          <Link
            :to="{
              name: 'cart',
              params: {
                uid: user.uid || new Date(),
                slug: convertToSlug(user.name) || 'gio-hang-thue-trang-phuc',
              },
            }"
          >
            <span class="cart-icon"
              ><i class="fa fa-shopping-cart" aria-hidden="true"></i></span
          ></Link>
          <div v-if="cartItems.length" class="cart-number">
            <span>{{ cartItems.length }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { authStore } from "@/stores/user.store";
import { storeToRefs } from "pinia";
import Link from "@/components/Link.vue";
// import Address from "@/components/Address.vue";
import { convertToSlug } from "@/utils/util.function";
import {useRoute, useRouter} from 'vue-router'
import { useCartStore } from "@/stores/cart.store";
import { defineAsyncComponent } from 'vue'
const route = useRoute();
const router = useRouter();
const auth = authStore();
const cart = useCartStore();
const {cartItems} = storeToRefs(cart);
const { user, loginRequest } = storeToRefs(auth);
const isLogin = computed(() => auth.isLoggedIn);
const search = ref("");
const userAccess = () => {
  //Chưa đăng nhập
  if (!isLogin.value) {
    //chỉ thị đăng nhập
    loginRequest.value = !loginRequest.value;
  }
};
const logOut = ()=>{
  auth.logout();
  if(route.meta.requiresAuth) {
    router.push("/");
  }
}
const searchOutfit = ()=>{
  router.push({name:"search", params:{keyword:search.value}});
}
// // const index = ref(0);
// // onMounted(() => {
// //     setInterval(() => {
// //         index.value = (index.value + 1) % slogan.value.length;
// //     }, 2000)
// // })
// const slogan = ref(["An khang", "Thịnh vượng", "Vạn sự như ý"]);

const Address = defineAsyncComponent({
  loader: () => import("@/components/Address.vue"),
  delay: 2000,
  errorComponent: () => {
    return '<div>Error loading Address component</div>';
  },
}
  
)
</script>

<style scoped>
.cart-container {
  position: relative;
}

.cart-number {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background-color: red;
  border-radius: 50%;
}

.cart-container > div > span {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  color: white;
}

.header-container {
  background: url("/images/header.jpg");
  padding: 0 0 20px 0;
}

.topbar {
  color: black;
  font-size: 15px;
}

.web-info {
  /* background-color: #46cf76; */
  color: white;
  font-size: 16px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ee58a6;
  /* background-color: #E4338F;   */
}

.web-info div {
  flex: 1 1 auto;
}

.contact-social-account {
  text-align: end;
}

.account-container {
  border: 1px solid rgb(243, 243, 243);
  cursor: pointer;
}

.account-container {
  min-width: 30px;
  max-width: 200px;
  position: relative;
}

.account-container::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 15px;
}

.account-container .account-action {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #f8cccd;
  border-top: 1px solid rgb(243, 243, 243);
  border-radius: 5px;
  z-index: 999;
  transition: all 0.3s ease-in-out;
}

.account-container .account-action span {
  display: block;
  padding: 5px 20px 5px 20px;
  width: 100%;
  color: rgb(190, 0, 190);
}

.account-container .account-action span:hover {
  background-color: #f9d9da;
}

.account-container:hover .account-action {
  opacity: 1;
  visibility: visible;
  top: 130%;
}

.account-container .user-account {
  min-width: 30px;
  max-width: 150px;
  overflow: hidden;
}

.account-container .user-account > span {
  width: 100%;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.account-container .user-account span:last-child {
  text-align: center;
}

.location-container span:not(.location-icon),
.account-container span:not(.account-icon) {
  font-size: 14px;
}

.location-container span:not(.location-icon):last-child,
.account-container span:not(.account-icon):last-child {
  font-weight: bold;
}

.location-icon,
.account-icon,
.search-bar,
.cart-icon {
  margin-right: 10px;
  font-size: 25px;
  cursor: pointer;
}
.search-bar {
  font-size:initial;
  width: 230px;
  display: flex;
  justify-content: flex-end;
}
.search-container {
  position: relative;
  box-sizing: border-box;
  width: fit-content;
}

.mainbox {
  box-sizing: border-box;
  position: relative;
  width: 230px;
  height: 50px;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: center;
  border-radius: 160px;
  background-color:rgb(255,255,255);
  transition: all 0.3s ease;
}

.search-checkbox:focus {
  border: none;
  outline: none;
}

.search-checkbox:checked {
  right: 10px;
}

.search-checkbox:checked ~ .mainbox {
  width: 50px;
}

.search-checkbox:checked ~ .mainbox .search_input {
  width: 0;
  height: 0px;
}

.search-checkbox:checked ~ .mainbox .iconContainer {
  padding-right: 8px;
}

.search-checkbox {
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  position: absolute;
  right: 17px;
  top: 10px;
  z-index: 9;
  cursor: pointer;
  appearance: none;
}

.search_input {
  box-sizing: border-box;
  height: 100%;
  width: 170px;
  background-color: transparent;
  border: none;
  outline: none;
  padding-bottom: 4px;
  padding-left: 10px;
  font-size: 1em;
  color: #ee58a6;
  transition: all 0.3s ease;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.search_input::placeholder {
  color: rgba(255, 255, 255, 0.776);
}

.iconContainer {
  box-sizing: border-box;
  /* padding-top: 5px; */
  width: fit-content;
  transition: all 0.3s ease;
}

.search_icon {
  box-sizing: border-box;
  fill: #ee58a6;
  font-size: 1.3em;
}
</style>
