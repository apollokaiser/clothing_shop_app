<script setup>
import { useCartStore } from '@/stores/cart.store';
import { usePromotionStore } from '@/stores/promotion.store';
import { storeToRefs } from 'pinia';
import { ref,onBeforeMount, computed, watch, callWithErrorHandling } from 'vue';
import convertToVND from '@/utils/convertVND';
const cart = useCartStore()
const khuyenMai = usePromotionStore()
const {cartDetail} = storeToRefs(cart)
const {promotion} = storeToRefs(khuyenMai)
const props = defineProps({
    product:{
        type: Object,
        required: true
    }
})
const thisCartDetail = ref("");
watch(cartDetail, (value)=>{
    thisCartDetail.value = value.find(item=>item.id == props.product.id);
 },{
    deep: true,
    immediate: true,
 });
const price = computed(()=>{
    let giaTien = 0;
    if(props.product.full) giaTien = thisCartDetail.value.giaTronBo; 
    else giaTien = thisCartDetail.value.giaTien;
   let price = giaTien * props.product.quantity;
   let thisPromotion = promotion.value.find(item => item.khuyenMai.maKhuyenMai == props.product.promotion);
   if(thisPromotion){
       price = thisPromotion.khuyenMai.giamTien > 0 ? price - thisPromotion.khuyenMai.giamTien : (thisPromotion.khuyenMai.phanTramGiam / 100) * price;
   }
    return price;
});
</script>

<template>
    <div class="order-product-item">
        <div class="order-item-description">
            <div class="order-item-name">{{ thisCartDetail.tenTrangPhuc }}</div>
            <div class="order-item-detail">
                <span>Kích thước : <em>{{ props.product.size || 'Không' }}</em></span>
                <span>Mã: <em>{{ props.product.id }}</em></span>
            </div>
        </div>
        <div class="order-item-price">
            <span><em>{{ convertToVND(price) }}</em></span>
            <span>x <em>{{ props.product.quantity }}</em></span>
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
    margin:5px 0;
}
.order-item-description,
.order-item-price {
    width: 70%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
}.order-item-description .order-item-name {
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
