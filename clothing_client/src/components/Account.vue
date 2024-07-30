<template>
  <div class="container user-info mt-2">
    <div class="col-3 user-action">
      <ul class="action-link">
        <Link :to="{ name: 'account_profile' }" v-bind="$attrs"  exact-active-class="active-link" inactive-class="inactive-link"><li>Thông tin tài khoản</li></Link>
        <Link :to="{ name: 'lich-su-thue' }"  v-bind="$attrs" exact-active-class="active-link" inactive-class="inactive-link"><li>Lịch sử giao dịch</li></Link>
        <Link to="/gggg"  v-bind="$attrs" exact-active-class="active-link" inactive-class="inactive-link"><li>Hỗ trợ</li></Link>
        <Link to="/ggg"  v-bind="$attrs" exact-active-class="active-link"  inactive-class="inactive-link"><li>Góp ý - Phản hồi</li></Link>
        <li @click="logOut">Đăng xuất</li>
      </ul>
    </div>
    <div class="col-7 user-info-view">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { RouterView } from "vue-router";
import { authStore } from "@/stores/user.store";
import Link from "./Link.vue";
const auth = authStore();
const router = useRouter();
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
.active-link {
  color:#010e70;
  font-weight: bold;
  transition: all 0.3s ease;
}
.active-link li {
  border-bottom: 1px solid #001df7 !important;
}
.active-link:hover {
  color:#7181ff;
}
.inactive-link {
  color: initial;
  background-color: red;
}
</style>
