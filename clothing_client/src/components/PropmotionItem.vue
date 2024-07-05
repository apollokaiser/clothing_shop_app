<script setup>

import { usePromotionStore } from '@/stores/promotion.store';
import { useCartStore } from '@/stores/cart.store';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
const khuyenMai = usePromotionStore()
const cart = useCartStore()
const {myPaymentPromotion, myPromotion, totalDiscount} = storeToRefs(khuyenMai)
const {cartItems, cartDetail, totalPrice, cartCount} = storeToRefs(cart)
const processing  = computed(()=>{
    if(props.category) {
        return false;
    }else if(props.payment) {
        if(myPaymentPromotion.value != null) {
            if(myPaymentPromotion.value.maKhuyenMai == props.promotion.maKhuyenMai) return '100%';
        }
        else {
            let total = totalPrice.value - totalDiscount.value;
                let processPercent = props.promotion.giaTriToiThieu == 0 ? (cartCount * 100)/props.promotion.soLuongToiThieu : (total*100) /props.promotion.giaTriToiThieu
                return `${processPercent}%`;
        }
    }
    return '0%';
                
})
const props = defineProps({
    promotion:{
        type:Object,
        required:true,
    },
    category:{
        type:Boolean,
        required:false,
    },
    payment:{
        type:Boolean,
        required:false,
    }
})
</script>

<template>
    <div class="promotion-item">
        <div class="promotion-name">
            <div>{{ props.promotion.khuyenMai?.tenKhuyenMai || props.promotion.tenKhuyenMai }}</div>
        </div>
        <div class="promotion-detail-btn">
            Chi tiết
        </div>
        <div class="promotion-detail">
            {{ props.promotion.khuyenMai?.moTa || props.promotion.moTa}}
        </div>
        <div class="promotion-item-progress-bar">
            <div class="promotion-item-progress">
                <hr :style="{width: processing}">
            </div>
            <div class="promotion-item-progress-minmax">
                <em v-if="processing!='100%'">Thuê ngay để nhận ưu đãi</em>
                <em v-else>Đã đạt mức ưu đãi</em>
            </div>
        </div>
        <!--FIXME: chuyển hướng sang /danh-muc/:slug/:id-->
        <div class="add-more-item">
            <button>Xem thêm</button>
        </div>
    </div>
</template>
<style scoped>
    .promotion-item {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    /* line-height: 1.5rem; */
    align-items: center;
    flex-wrap: wrap;
    padding-bottom: 20px;
    border-bottom: 1px solid #ec4899;
}
.promotion-item .promotion-detail-btn{
    color: teal;
    cursor: pointer;
}
.promotion-name {
    width: 80%;
    font-weight: 700;
}
.promotion-name>div {
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.promotion-item .promotion-detail{
    width: 100%;
    color: #858585;
}
.promotion-item .promotion-item-progress-bar{
    width: 60%;
    margin-top:15px;
}
.promotion-item-progress{
    position: relative;
    height: 6px;
    width: 100%;
    background-color: aqua;
    border-radius: 10px;
    overflow: hidden;
}
.promotion-item-progress hr{
    position: absolute;
    height: 6px;
    left: 0;
    top:0;
    background-color: rgb(0, 53, 96);
    margin:0;
    padding:0;
}
.promotion-item-progress-minmax em{
    font-size:12px;
}
.add-more-item button {
  position: relative;
  background-color: rgb(230, 34, 77);
  border-radius: 5px;
  box-shadow: rgb(121, 18, 55) 0px 4px 0px 0px;
  padding: 0 15px;
  background-repeat: no-repeat;
  cursor: pointer;
  box-sizing: border-box;
  width: 100px;
  height: 30px;
  color: #fff;
  border: none;
  font-size: 15px;
  transition: all 0.2s ease-in-out;
  z-index: 1;
  overflow: hidden;
}
.add-more-item button::before {
  content: "";
  background-color: rgb(248, 50, 93);
  width: 0;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  transition: width 300ms ease-in-out;
  display: inline-block;
}

.add-more-item button:hover::before {
  width: 100%;
}
</style>