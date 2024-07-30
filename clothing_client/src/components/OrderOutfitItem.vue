<script setup>
import { useCartStore } from "@/stores/cart.store";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import convertToVND from "@/utils/convertVND";
const cart = useCartStore();
const { cartDetail } = storeToRefs(cart);
//cartIten
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});
const thisCartDetail = computed(()=>{
  return cartDetail.value.find(item => item.id == props.product.parentId);
})
const thisOutfitPiece = computed(()=>{
  if(props.product.parentId == props.product.id) return thisCartDetail.value;
  return thisCartDetail.value.manhTrangPhucs.find(piece => piece.id == props.product.id);
})
const price = computed(() => {
  let giaTien = thisOutfitPiece.value.giaTien;
  let price = giaTien * props.product.quantity - props.product.discount;
  return price;
});
</script>

<template>
  <div class="order-product-item">
    <div class="order-item-description">
      <div class="order-item-name">{{ thisCartDetail.tenTrangPhuc }} <b class="text-warning" v-if="thisCartDetail.manhTrangPhucs?.length >0"> - {{ thisOutfitPiece.tenTrangPhuc }}</b></div>
      <div class="order-item-detail">
        <span
          >Kích thước : <em>{{ props.product.size !="NONE" ? props.product.size : 'Không' }}</em></span
        >
        <span
          >Mã: <em>{{ props.product.id }}</em></span
        >
      </div>
    </div>
    <div class="order-item-price">
      <span
        ><em>{{ convertToVND(price) }}</em></span
      >
      <span
        >x <em>{{ props.product.quantity }}</em></span
      >
    </div>
  </div>
</template>

<style scoped>
.order-product-item {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0;
}
.order-item-description,
.order-item-price {
  width: 70%;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}
.order-item-description .order-item-name {
  overflow: hidden;
  text-align: left;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  line-height: 1.4em;
  height: 3em;
  font-size: 14px;
  font-weight: bold;
}
.order-item-price {
  width: 20%;
  justify-content: flex-start;
  align-items: flex-end;
}
.order-item-detail {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}
</style>
