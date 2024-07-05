<template>
  <div class="container user-info mt-2">
    <div class="col-3 user-action">
      <ul class="action-link">
        <Link :to="{ name: 'account_profile' }"><li>Thông tin tài khoản</li></Link>
        <Link :to="{ name: 'lich-su-thue' }"><li>Lịch sử giao dịch</li></Link>
        <Link to=""><li>Hỗ trợ</li></Link>
        <Link to=""><li>Góp ý - Phản hồi</li></Link>
        <li @click="logOut">Đăng xuất</li>
      </ul>
    </div>
    <div class="col-7 user-info-view">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { RouterView } from "vue-router";
import { authStore } from "@/stores/user.store";
import { storeToRefs } from "pinia";
import Link from "./Link.vue";
const auth = authStore();
const route = useRoute();
const router = useRouter();
const { user, isLoggedIn, accessToken } = storeToRefs(auth);
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  uid: { type: String, required: true },
});
const logOut = ()=>{
  auth.logout();
  router.push("/");
}
</script>

<style scoped>
.user-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  background-color: #fff;
  min-height: 60vh;
  max-height: 100vh;
}
.user-action {
  position: relative;
  background-color: #f6fbfc;
  padding: 5px;
  border-radius: 10px;
  margin-right: 30px;
}
.user-action::after {
  position: absolute;
  right: 0;
  top: 0;
  content: "";
  height: 100%;
  padding: 10px;
  border-right: 1px solid #ccc;
}
.user-action ul.action-link {
  padding-left: 0;
}
.user-action .action-link li {
  cursor: pointer;
  display: inline-block;
  width: 100%;
  padding: 10px;
  padding-left: 2rem;
  border-radius: 10px;
}
</style>
