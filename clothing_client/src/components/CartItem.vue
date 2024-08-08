<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import Link from './Link.vue';
import { Toast } from '@/utils/notification';
import { useCartStore } from '@/stores/cart.store';
import { usePromotionStore } from '@/stores/promotion.store';
import { storeToRefs } from 'pinia';
import convertToVND from '@/utils/convertVND';
import { sortSizes, shortCurrency } from '@/utils/util.function';
const cart = useCartStore()
const khuyenMai = usePromotionStore();
const { promotion } = storeToRefs(khuyenMai);
const { cartDetail } = storeToRefs(cart)
// NOTE: props.item = cartItem
const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})
const thisCartItem = ref("");
const thisPiece = computed(() => {
    if (thisCartItem.value.id == thisCartItem.value.parentId) return thisCartDetail.value;
    if (thisCartDetail.value) return thisCartDetail.value.manhTrangPhucs.find(size => size.id == props.item.id);
    return null;
})
const thisCartDetail = computed(() => {
    return cartDetail.value?.find(item => item.id == props.item.parentId);
})
const thisPromotion = ref("");
onBeforeMount(() => {
    thisCartItem.value = Object.assign({}, props.item);
})
const thisSize = computed(() => {
    if (thisPiece.value) return thisPiece.value.kichThuocs.find(size => size.maKichThuoc == props.item.size);
    return null;
})
const quantityHandle = {
    add: () => {
        if (thisCartItem.value.quantity < thisSize.value?.soLuong) {
            thisCartItem.value.quantity++;
        } else {
            Toast.fire({
                icon: 'error',
                title: 'Không thể thêm'
            })
            thisCartItem.value.quantity = thisSize.value?.soLuong;
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
    if (value) {
        let myPromotion = khuyenMai.checkPromotion(thisCartDetail.value.theLoai);
        if (myPromotion) {
            thisPromotion.value = myPromotion;
        }
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
    if (thisCartItem.value.quantity > thisPromotion.value.soLuongToiThieu && thisPiece.value.giaTien * thisCartItem.value.quantity >= thisPromotion.value.giaTriToiThieu) {
        props.item.promotion = thisPromotion.value.maKhuyenMai;
        return true;
    } else {
        props.item.validPromoCode = thisPromotion.value.maKhuyenMai;
        props.item.promotion = null;
        return false;
    }
})
const price = computed(() => {
    let giaTien = thisPiece.value.giaTien;
    let tamTinh = giaTien * thisCartItem.value.quantity;
    let price = tamTinh;
    if (activePromotion.value) {
        price = price - thisPromotion.value.giamTien - (thisPromotion.value.phanTramGiam / 100) * price;
    }
    props.item.discount = tamTinh - price;
    return price;
})
const originPrice = computed(() => {
    return thisPiece.value.giaTien * thisCartItem.value.quantity;
})
const discountTagValue = computed(() => {
    if (activePromotion.value) {
        return thisPromotion.value.giamTien > 0 ? shortCurrency(thisPromotion.value.giamTien) : thisPromotion.value.phanTramGiam + "%";
    }
})
const disabledSize = computed(() => {
    if (thisPiece.value) {
        return thisPiece.value.kichThuocs.filter(size => size.soLuong == 0 || !size.trangThai).map(size => size.maKichThuoc);
    }
})
watch(() => thisCartItem.value.size, () => {
    cart.changeCartItemSize(thisCartItem.value, props.item.size)
}
)
watch(() => thisCartItem.value.id, (newVal) => {
    if (newVal != props.item.id)
        cart.changeCartItemId(thisCartItem.value, props.item.id, props.item.size);
})
watch(() => thisCartItem.value.quantity, (oldValue) => {
    if (oldValue) {
        cart.addCart(thisCartItem.value, null, true);
    }
}
)
const removeCartItem = () => {
    cart.removeCart(thisCartItem.value.id, thisCartItem.value.size);
}
const hasSize = computed(() => {
    if (thisPiece.value)
        return thisPiece.value.kichThuocs[0] != "NONE";
    return false;
})
const disabledPiece = computed(()=>{
    if (thisCartDetail.value) {
       let disabled = thisCartDetail.value.manhTrangPhucs.filter(manh => !manh.tinhTrang || manh.kichThuocs.every(size=> size.soLuong ==0 || !size.trangThai))
       if(disabled.length)
        return disabled.map(manh=> manh.id);
    } return []
})
const chooseRadio = computed(() => thisCartItem.value.id + "-" + thisCartItem.value.size)
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
                <input :disabled="disabledSize.includes(props.item.size)" v-model="props.item.check"
                    class="hidden-xs-up radio-check" :id="chooseRadio" type="checkbox" :checked="props.item.check">
                <label class="cbx" :for="chooseRadio"></label>
            </div>
        </div>
        <div class="cart-item-img">
            <div class="cart-img-preview">
                <img :src="thisCartDetail.hinhAnh" :alt="thisCartDetail.tenTrangPhuc">
            </div>
        </div>
        <div class="cart-item-info col-sm-7">
            <div class="cart-item-name">
                <h3 :class="{
                    'text-decoration-line-through': disabledSize.includes(props.item.size),
                    'text-muted': disabledSize.includes(props.item.size)
                }">
                    <Link to="/product-detail">
                    <span> {{ thisCartItem.id }} - {{ thisCartDetail.tenTrangPhuc }} </span>
                    </Link>
                </h3>
                <span class="text-danger" v-if="disabledSize.includes(props.item.size)"> (tạm hết)</span>
            </div>
            <div class="cart-item-size col-sm-10">
                <span v-if="hasSize">Kích thước :
                    <select v-model="thisCartItem.size">
                        <option v-for="size in sortSizes(thisPiece.kichThuocs)" :key="size.maKichThuoc"
                            :value="size.maKichThuoc" :disabled="disabledSize.includes(size.maKichThuoc)">
                            {{ size.maKichThuoc }}</option>
                    </select>
                </span>
                <span v-if="thisCartDetail.manhTrangPhucs.length > 0" class="classify">{{ thisPiece.tenTrangPhuc
                    }}</span>
                <v-menu transition="slide-x-transition" :close-on-content-click="false" location="bottom"
                    v-if="thisCartDetail.manhTrangPhucs.length > 0">
                    <template v-slot:activator="{ props }">
                        <svg class="change-classify" v-bind="props" xmlns="http://www.w3.org/2000/svg" width="24"
                            height="24" viewBox="0 0 24 24" fill="none" stroke="#bd10e0" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M2.5 2v6h6M21.5 22v-6h-6" />
                            <path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2" />
                        </svg>
                    </template>
                    <v-card>
                        <v-sheet class="mx-auto" elevation="10" max-width="300">
                            <v-sheet class="pa-3 bg-primary text-right d-flex justify-space-between align-center">
                                <div>Chọn phân loại</div>
                            </v-sheet>
                            <div class="pa-4 classify">
                                <v-chip-group v-model="thisCartItem.id" selected-class="text-primary" column filter>
                                    <v-chip :disabled="disabledPiece.includes(piece.id)" v-for="piece in thisCartDetail.manhTrangPhucs"
                                        :key="piece.id" :value="piece.id">
                                        {{ piece.tenTrangPhuc }}
                                    </v-chip>
                                </v-chip-group>
                            </div>
                        </v-sheet>
                    </v-card>
                </v-menu>
                <!-- <span>Mã TP: {{ thisCartItem.id }}</span> -->
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
    padding: 0 10px;
    overflow: hidden;
}

.cart-img-preview {
    width: 100%;
    height: 100%;
}

.cart-img-preview img {
    width: 100px;
    height: 100%;
    object-fit: cover;

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

.cart-item-info a {
    word-break: break-all;

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
    padding: 2px 20px;
    outline: none;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.cart-item-info .cart-item-size span>select option:disabled {
    color: #ccc;
    text-decoration: line-through;
}

span.classify {
    color: red;
    font-weight: 600;
    font-style: italic;
    font-size: 15px;
}

svg.change-classify {
    cursor: pointer;
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