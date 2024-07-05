<template>
  <div class="order-history-container">
    <div class="order-history-header">
      <i @click="goBack" class="fa fa-long-arrow-left me-2" aria-hidden="true"></i>
      <div>Thông tin đặt trang phục</div>
    </div>
    <div v-if="order.length==0" class="no-order mt-2">
        <p>Không tìm thấy đơn hàng nào</p>
        <p>Thuê ngay để nhận những ưu đãi cho cá nhân nào !</p>
        <Link to="/"><span>Trở lại</span></Link>
    </div>
    <div class="has-order">
        <OrderHistoryItem v-for="(item, index) in order" :key="index" :order="item"></OrderHistoryItem>
    </div>
  </div>
</template>
<style scoped>
.order-history-header {
display: flex;
justify-content: space-between;
align-items: center;
padding: 10px;
background-color: #f8f9fa;
font-size: 24px;
border-bottom: 1px solid #dee2e6;
font-style: italic;
}
.order-history-header > i {
cursor: pointer;
}
.no-order,
.has-order {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.has-order {
    margin-top: 20px;
}
.no-order >p:first-child {
    font-size: 24px;
    color: #6c757d;
}
.no-order span {
    color: #17a2b8;
    font-size: 18px;
    margin-top: 10px;
    cursor: pointer;
}
</style>
<script setup>
import { useRouter } from "vue-router";
const  router = useRouter();
import {getOrders} from "@/data.function/getData";
import {authStore} from '@/stores/user.store'
import { onBeforeMount,ref } from "vue";
import Link from '@/components/Link.vue';
import OrderHistoryItem from '@/components/OrderHistoryItem.vue';
const auth = authStore();
const order = ref([]);

onBeforeMount(()=>{
    getOrders(auth.user.uid).then(response =>{
        order.value = response;
    })
})
function goBack() {
  router.back();
}
</script>
