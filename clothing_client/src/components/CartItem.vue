<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import Link from './Link.vue';
import { useCartStore } from '@/stores/cart.store';
import { usePromotionStore } from '@/stores/promotion.store';
import { storeToRefs } from 'pinia';
import convertToVND from '@/utils/convertVND';
import { sortSizes, shortCurrency } from '@/utils/util.function';
const cart = useCartStore()
const khuyenMai = usePromotionStore();
const { promotion } = storeToRefs(khuyenMai);
const { cartDetail } = storeToRefs(cart)
const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})
const thisCartItem = ref("");
const thisCartDetail = computed(() => {
    return cartDetail.value?.find(item => item.id == props.item.id);
})
const thisPromotion = ref("");
onBeforeMount(() => {
    thisCartItem.value = props.item
})
const quantityHandle = {
    add: () => {
        if (thisCartItem.value.quantity < thisCartDetail.value.soLuong) {
            thisCartItem.value.quantity++;
        } else {
            alert("Số lượng trang phục không đủ !")
            thisCartItem.value.quantity = thisCartDetail.value.soLuong;
        }

    },
    reduce: () => {
        if (thisCartItem.value.quantity > 1) {
            thisCartItem.value.quantity--;
        } else {
            thisCartItem.value.quantity = 1;
        }
    }
}
watch(promotion, (value) => {
    let myPromotion = khuyenMai.checkPromotion(thisCartDetail.value.theLoai);
    if (myPromotion) {
        thisPromotion.value = myPromotion;
    }
}, {
    deep: true,
    immediate: true
})
const activePromotion = computed(() => {
    if (thisPromotion.value == "") {
        return false;
    }
    if (thisPromotion.value.soLuongToiThieu == 0 && thisPromotion.value.giaTriToiThieu == 0) {
        props.item.promotion = thisPromotion.value.maKhuyenMai;
        return true;
    }
    if (thisPromotion.value.soLuongToiThieu > 0) {
        if (thisCartItem.value.quantity >= thisPromotion.value.soLuongToiThieu) {
            props.item.promotion = thisPromotion.value.maKhuyenMai;
            return true;
        } else {
            props.item.promotion = null;
            return false;
        }  
    } if (thisPromotion.value.giaTriToiThieu > 0) {
        if (thisCartDetail.value.giaTien * thisCartItem.value.quantity >= thisPromotion.value.giaTriToiThieu) {
            props.item.promotion = thisPromotion.value.maKhuyenMai;
            return true;
        } else{
            props.item.promotion = null;
            return false;
        } 
    }
    return false;
})
const price = computed(() => {
    let giaTien = 0;
    if(thisCartItem.value.full) giaTien = thisCartDetail.value.giaTronBo;
    else giaTien = thisCartDetail.value.giaTien;
    let tamTinh = giaTien * thisCartItem.value.quantity;
    let price = tamTinh;
    if (activePromotion.value) {
        if (thisPromotion.value.giaTriToiThieu > 0) {
            price = thisPromotion.value.giamTien > 0 ? price - thisPromotion.value.giamTien : (thisPromotion.value.phanTramGiam / 100) * price;
        }
        if (thisPromotion.value.soLuongToiThieu > 0) {
            price = thisPromotion.value.giamTien > 0 ? price - thisPromotion.value.giamTien : (thisPromotion.value.phanTramGiam / 100) * price;
        }
    }
    props.item.discount = tamTinh - price;
    return price;
})
const originPrice = computed(()=>{
    let giaTien = 0;
    if(props.item.check) giaTien = thisCartDetail.value.giaTronBo;
    else giaTien = thisCartDetail.value.giaTien;
    return giaTien * thisCartItem.value.quantity;
})
const discountTagValue = computed(() => {
    if (activePromotion.value) {
        return thisPromotion.value.giamTien > 0 ? shortCurrency(thisPromotion.value.giamTien) : thisPromotion.value.phanTramGiam + "%";
    }
})
watch(() => thisCartItem.value.size, (value, oldValue) => {
    if (oldValue) {
        cart.changeCartItemSize(thisCartItem.value, oldValue);
    }
}
)
watch(() => thisCartItem.value.quantity, (value, oldValue) => {
    if (oldValue) {
        cart.addCart(thisCartItem.value, null, true);
    }
}
)
const removeCartItem = () => {
    cart.removeCart(thisCartItem.value.id, thisCartItem.value.size, thisCartItem.value.full);
}
const hasSize = computed(() => thisCartDetail.value.kichThuocs.length > 0)
const chooseRadio = computed(() => thisCartItem.value.id + "-" + thisCartItem.value.size + "-" + thisCartItem.value.full)
</script>

<template>
    <div class="cart-item mb-2">
        <!--UPDATED: đã chỉnh sửa-->
            <div v-if="activePromotion" class="discount-tag">
                <div class="discount-tag-img">
                    <img src="/images/discount-tag.png" alt="">
                    <div class="discount-tag-value">-{{ discountTagValue }}</div>
                </div>
            </div>
        <div class="cart-item-choose">
            <div class="cntr">
                <input v-model="props.item.check" class="hidden-xs-up radio-check" :id="chooseRadio" type="checkbox" :checked="props.item.check">
                <label class="cbx" :for="chooseRadio"></label>
            </div>
        </div>
        <div class="cart-item-img">
            <div class="cart-img-preview">
                <img :src="thisCartDetail.hinhAnhs[0]" :alt="thisCartDetail.tenTrangPhuc">
            </div>
        </div>
        <div class="cart-item-info col-sm-7">
            <div class="cart-item-name">
                <h3>
                    <Link to="/product-detail">
                    <span>{{ thisCartDetail.tenTrangPhuc }}</span>
                    </Link>
                </h3>
            </div>
            <div class="cart-item-size col-sm-10">
                <span v-if="hasSize">Kích thước :
                    <select v-model="thisCartItem.size">
                        <option v-for="size in sortSizes(thisCartDetail.kichThuocs)" :value="size.maKichThuoc">{{
                            size.maKichThuoc }}</option>
                    </select>
                </span>
                <span class="is-full" v-if="thisCartItem.full">(Trọn bộ)</span>
                <span>Mã TP: {{ thisCartDetail.id }}</span>
            </div>
            <div class="cart-item-price">
                <div class="item-discount">
                    <span v-if="activePromotion">{{ convertToVND(price) }}</span>
                    <span v-else>{{ convertToVND(price) }}</span>
                </div>
                <div v-if='activePromotion' class="item-price">
                    <span>{{ convertToVND(originPrice) }}</span>
                </div>
            </div>
        </div>
        <div class="cart-item-action">
            <div class="cart-item-delete">
                <i class="fa fa-trash" @click="removeCartItem" aria-hidden="true"></i>
            </div>
            <div class="cart-item-quatity">
                <div class="number-control">
                    <div class="number-left" @click="quantityHandle.reduce"></div>
                    <input v-model="thisCartItem.quantity" type="number" name="number" class="number-quantity">
                    <div class="number-right" @click="quantityHandle.add"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>

.cart-item {
    width: 100%;
    display: flex;
    min-height: 1.5rem;
    height: auto;
    border: 1px solid #b7b5b5;
    border-radius: 10px;
    padding: 10px;
    position: relative;
}

.discount-tag {
    position: absolute;
    top: -5px;
    right: 15%;
    overflow: hidden;
    animation: slide_down 0.3s ease-in backwards;
}

@keyframes slide_down {
    0% {
        height: 0;
    }
    100% {
        height: 50px;
    }
}

.discount-tag-img {
    width: 50px;
    height: 50px;
}

.discount-tag-img img {
    position: relative;
    transform: scale(1.1);
}

.discount-tag-img .discount-tag-value {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    border-radius: 5px;
    padding: 2px 5px;
}


.cart-item>div {
    display: inline-flex;
}

.cart-item-img {
    overflow: hidden;
}

.cart-img-preview {
    width: 100%;
    height: 100%;
}

.cart-img-preview img {
    width: 100px;
    height: 100px;
}

.cart-item-info {
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    justify-content: space-between;
    align-items: flex-start;
}

.cart-item-info h3 {
    font-size: 20px;
    font-weight: 500;
    cursor: pointer;
}

.cart-item-info .cart-item-price {
    display: flex;
    gap: 15px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 17px;
}

.cart-item-info .cart-item-size {
    font-family: sans-serif;
    font-size: 14px;
    color: #929292;
    display: flex;
    justify-content: space-between;
}

.cart-item-info .cart-item-size span>select {
    cursor: pointer;
}

.cart-item-info .cart-item-size span.is-full {
    color: red;
    font-weight: 600;
    font-style: italic;
}

.cart-item-info .cart-item-price .item-price {
    color: #ccc;
    text-decoration: line-through;
}

.cart-item-info .cart-item-price .item-discount {
    color: red;
    font-weight: 600;
}

.cart-item-action {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
}
.cart-item-action i {
    cursor: pointer;
}

.cbx {
    position: relative;
    top: 1px;
    width: 25px;
    height: 25px;
    border: 1px solid #475569;
    border-radius: 20px;
    transition: background 0.2s ease;
    cursor: pointer;
    display: block;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.cbx:after {
    content: '';
    position: absolute;
    top: 2px;
    left: 8px;
    width: 7px;
    height: 14px;
    opacity: 0;
    transform: rotate(45deg) scale(0);
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transition: all 0.3s ease;
    transition-delay: 0.15s;
}

.radio-check:checked~.cbx {
    border-color: transparent;
    background: #ec4899;
    animation: jelly 0.4s ease;
}

.radio-check:checked~.cbx:after {
    opacity: 1;
    transform: rotate(45deg) scale(1);
}

.cntr {
    position: relative;
}

/* @keyframes jelly {
  from {
    transform: scale(1, 1);
  }

  20% {
    transform: scale(1.3, 0.7);
  }

  40% {
    transform: scale(0.7, 1.3);
  }

  60% {
    transform: scale(1.1, 0.9);
  }

  80% {
    transform: scale(0.9, 1.1);
  }

  to {
    transform: scale(1, 1);
  }
} */

.hidden-xs-up {
    display: none !important;
}
</style>