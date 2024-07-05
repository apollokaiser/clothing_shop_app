<template>
  <div class="admin-content">
    <div class="order-unconfirm col-sm-5 mt-3">
      <div>Chờ xác nhận</div>
      <div class="order-unconfirm-content">
        <div class="order-unconfirm-count">
          <span>5</span>
        </div>
        <span>Khách hàng</span>
      </div>
    </div>
    <div class="promotion-news col-sm-12 mt-3">
      <div>Danh sách khuyến mãi hiện có</div>
      <div class="promotion-news-content">
        <PropmotionItem v-for="item in promotions" :key="item.maKhuyenMai" :promotion="item"></PropmotionItem>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.admin-content {
  width: 100%;
  padding: 10px;
  display: flex;
  background-color: #ccc;
  justify-content: flex-start;

  flex-wrap: wrap;
}
.promotion-news,
.order-unconfirm {
  background-color: #fff;
  border-radius: 10px;
  padding: 2rem;
}
.promotion-news > div:first-child {
  font-weight: bold;
  font-size: 20px;
  color: #16bbe5 !important;
}
.order-unconfirm > div:first-child {
  font-weight: bold;
  font-size: 25px;
  color: #ff8100 !important;
}
.promotion-news-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.order-unconfirm {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 5px;
}
.order-unconfirm-content > span {
  margin-bottom: 0.5rem;
  color: orange;
  font-weight: bold;
}
.order-unconfirm-count {
  width: 100px;
  height: 100px;
  background-color: orange;
  border-radius: 50%;
  font-family: monospace, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
}
.order-unconfirm-count span {
  color: #fff;
  font-size: 40px;
  font-weight: bold;
}
</style>
<script setup>
import { onBeforeMount, ref } from "vue";
import { getPromotions } from "@/data.function/getData";
import PropmotionItem from "@/components/Admin/PromotionItem.vue";
import { useResource } from "@/stores/resource.store";
const resource = useResource();
const promotions = ref([]);
onBeforeMount(() => {
  getPromotions().then((res) => {
    promotions.value = res;
    resource.setPromotion(res);
  }); // Fetch data here and assign it to promotions.value
});
</script>
