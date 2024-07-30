<script setup>

import { usePromotionStore } from '@/stores/promotion.store';
import { useCartStore } from '@/stores/cart.store';
import { useResource } from '@/stores/resource.store';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import Link from './Link.vue';
import { ref } from 'firebase/storage';
import Swal from 'sweetalert2';
const khuyenMai = usePromotionStore()
const cart = useCartStore()
const resource = useResource()
const { myPaymentPromotion, totalDiscount } = storeToRefs(khuyenMai)
const { totalPrice, cartCount, cartItems, cartDetail } = storeToRefs(cart)
const processing = computed(() => {
    if (props.promotion.soLuongToiThieu == 0 && props.promotion.giaTriToiThieu == 0) return "100%";
    if (props.category) {
        let thisCartItem = cartItems.value.find(item => item.promotion == props.promotion.maKhuyenMai);
        if (thisCartItem) {
            return "100%";
        } else {
            let processPercent = 0;
            thisCartItem = cartItems.value.filter(item => item.validPromoCode == props.promotion.maKhuyenMai);
            if (thisCartItem) {
                thisCartItem.forEach(cart => {
                    let thisCartDetail = null;
                    let mainOutfitDetail = cartDetail.value.find(item => item.id == cart.parentId);
                    if (cart.id == cart.parentId) {
                        thisCartDetail = mainOutfitDetail;
                    } else {
                        thisCartDetail = mainOutfitDetail.manhTrangPhucs?.find(item => item.id == cart.id);
                    }
                    let percent = props.promotion.giaTriToiThieu == 0 ? cart.quantity * 100 / props.promotion.soLuongToiThieu : (cart.quantity * thisCartDetail.giaTien * 100) / props.promotion.giaTriToiThieu;
                    if (percent > 100) percent = 100
                    if(percent > processPercent) processPercent = percent
                })
                return `${processPercent}%`;
            }
            // let thisCartDetail = null;
            // let mainOutfitDetail = cartDetail.value.find(item => item.id == thisCartItem.parentId);
            // if (thisCartItem.id == thisCartItem.parentId) {
            //     thisCartDetail = mainOutfitDetail;
            // } else {
            //     thisCartDetail = mainOutfitDetail.manhTrangPhucs?.find(item => item.id == thisCartItem.id);
            // }
            // let processPercent = props.promotion.giaTriToiThieu == 0 ? thisCartItem.quantity * 100 / props.promotion.soLuongToiThieu : (thisCartItem.quantity * thisCartDetail.giaTien * 100) / props.promotion.giaTriToiThieu;
            // if (processPercent > 100) processPercent = 100
            // return `${processPercent}%`;
        }
    } else if (props.payment) {
        if (myPaymentPromotion.value != null) {
            if (myPaymentPromotion.value.maKhuyenMai == props.promotion.maKhuyenMai) return '100%';
        }
        else {
            let total = totalPrice.value - totalDiscount.value;
            let processPercent = props.promotion.giaTriToiThieu == 0 ? (cartCount * 100) / props.promotion.soLuongToiThieu : (total * 100) / props.promotion.giaTriToiThieu
            if (processPercent > 100) processPercent = 100
            return `${processPercent}%`;
        }
    }
    return '0%';

})
const props = defineProps({
    promotion: {
        type: Object,
        required: true,
    },
    category: {
        type: Boolean,
        required: false,
    },
    payment: {
        type: Boolean,
        required: false,
    }
})
const showDetail = () => {
    Swal.fire({
        title: 'Chi tiết khuyến mãi',
        html: props.promotion.noiDungChinh,
        confirmButtonText: 'Đã hiểu'
    })
}
</script>

<template>
    <div class="promotion-item">
        <div class="promotion-name">
            <div>{{ props.promotion.khuyenMai?.tenKhuyenMai || props.promotion.tenKhuyenMai }}</div>
        </div>
        <div @click="showDetail" class="promotion-detail-btn">
            Chi tiết
        </div>
        <div class="promotion-detail">
            {{ props.promotion.khuyenMai?.moTa || props.promotion.moTa }}
        </div>
        <div class="promotion-item-progress-bar">
            <div class="promotion-item-progress">
                <hr :style="{ width: processing }">
            </div>
            <div class="promotion-item-progress-minmax">
                <em v-if="processing != '100%'">Thuê ngay để nhận ưu đãi</em>
                <em v-else>Đã đạt mức ưu đãi</em>
            </div>
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

.promotion-item .promotion-detail-btn {
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

.promotion-item .promotion-detail {
    width: 100%;
    color: #858585;
}

.promotion-item .promotion-item-progress-bar {
    width: 60%;
    margin-top: 15px;
}

.promotion-item-progress {
    position: relative;
    height: 6px;
    width: 100%;
    background-color: aqua;
    border-radius: 10px;
    overflow: hidden;
}

.promotion-item-progress hr {
    position: absolute;
    height: 6px;
    left: 0;
    top: 0;
    background-color: rgb(0, 53, 96);
    margin: 0;
    padding: 0;
}

.promotion-item-progress-minmax em {
    font-size: 12px;
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