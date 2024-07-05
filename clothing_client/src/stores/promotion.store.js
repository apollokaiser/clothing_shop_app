import { defineStore, storeToRefs } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import { getPromotionCategory, getPromotionPayment } from "@/data.function/getData";
import { useCartStore } from "./cart.store";
export const usePromotionStore = defineStore("promotion", () => {
    const promotion = ref([]);
    const paymentPromotion = ref([]);
    const cart = useCartStore();
    const myPaymentPromotion = ref("");
    const { cartItems, cartDetail, totalPrice, cartCount } = storeToRefs(cart)
    const promotionCode = reactive({
        code: "",
        promotion: "",
        expired: false,
        invalid: false,
        check: false,
    });
    const myPromotion = computed(() => {
        if (promotion.value && promotion.value.length > 0) {
            if (cartDetail.value && cartDetail.value.length > 0) {
                let category = cartDetail.value.map(cat => cat.theLoai);
                return promotion.value.filter(item => category.includes(item.maLoai));
            }
        }
        return 0;
    })
    const checkPromotion = (catID) => {
        if (!catID || !promotion.value.length) return 0;
        return promotion.value.find(item => item.maLoai === catID);
    }
    const totalDiscount = computed(() => {
        let discount = 0;
        let cartPromotion = cartItems.value.filter(cartItem => cartItem.promotion != null && cartItem.check == true)
        cartPromotion.forEach(element => {
            let thisPro = myPromotion.value?.find(p => p.khuyenMai.maKhuyenMai == element.promotion).khuyenMai;
            discount += thisPro.giamTien + (1 - thisPro.phanTramGiam /100) * cartDetail.value.find(cart => cart.id == element.id).giaTien * element.quantity;
        })
        if (promotionCode.check) {
            let value = promotionCode.promotion.donVi == "PERCENT" ? (promotionCode.promotion.giaTriGiam / 100) * (totalPrice.value - discount) : promotionCode.promotion.giaTriGiam;
            if (value > promotionCode.promotion.giamToiDa)
                value = promotionCode.promotion.giamToiDa;
            discount += value;
        }
        if(paymentPromotion.value.length > 0 ) {
            let totalTemp = totalPrice.value - discount;
            let promo = paymentPromotion.value.filter(promotion => cartCount.value >= promotion.soLuongToiThieu && totalTemp > promotion.giaTriToiThieu);
            if(promo.length > 0) {
                let max = {
                    price:0,
                    item: ""
                }
                promo.forEach(item=>{
                                let current = item.giamTien + (item.phanTramGiam /100)* totalTemp;
                                if(current > max.price){
                                    max.item = item;
                                    max.price = current;
                                }
                            })
            myPaymentPromotion.value = max.item;
            discount += max.price > max.item.giamToiDa ? max.item.giamToiDa :max.price;
            } else {
                myPaymentPromotion.value = null;
            }
            
        }
        return discount.toFixed(0);
    })

    //NOTE: gọi sao khi load applicationStater để lấy dữ liệu về promotion
    const loadPromotionInstance = () => {
        getPromotionCategory().then(response => {
            if (response) {
                promotion.value = response;
            }
        })
    }
    const paymentPromotionInstance = () => {
        getPromotionPayment().then(response => {
            if (response) {
                paymentPromotion.value = response;
            }
        })
    }
    return { promotion, paymentPromotion, promotionCode, myPromotion, totalDiscount,myPaymentPromotion, checkPromotion, loadPromotionInstance, paymentPromotionInstance }
});