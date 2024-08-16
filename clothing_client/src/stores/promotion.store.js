import { defineStore, storeToRefs } from "pinia";
import { computed, reactive, ref } from "vue";
import { getPromotionCategory, getPromotionPayment } from "@/data.function/getData";
import { useCartStore } from "./cart.store";
export const usePromotionStore = defineStore("promotion", () => {
    const cart = useCartStore();
    const { cartItems, cartDetail, totalPrice, cartCount } = storeToRefs(cart)
    const promotion = ref([]);
    const paymentPromotion = ref([]);
    const myPaymentPromotion = ref("");
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
                let category = cartDetail.value.map(detail => detail.theLoai); // danh sách các thể loại của sản phẩm trong cart
                return promotion.value.filter(item => {
                    if (category.some(cat => item.theLoais.includes(cat))) return true;
                    return false;
                });
            }
        }
        return 0;
    })
    const checkPromotion = (catID) => {
        if (!catID || !promotion.value.length) return 0;
        return promotion.value.find(item => item.theLoais.includes(catID));
    }
    const totalDiscount = computed(() => {
        let discount = 0;
        let cartPromotion = cartItems.value.filter(cartItem => cartItem.promotion != null && cartItem.check == true)
        cartPromotion.forEach(element => {
            let mainOutfit =  cartDetail.value.find(cart => cart.id == element.parentId);
            let outfitPiece = null;
            if(element.id == element.parentId) 
                outfitPiece = mainOutfit;
            else {
                console.log(mainOutfit);
                outfitPiece = mainOutfit.manhTrangPhucs.find(piece=> piece.id == element.id);
                
            }
            let thisPro = myPromotion.value?.find(p => p.maKhuyenMai == element.promotion);
            let giamGia = thisPro.giamTien + (thisPro.phanTramGiam / 100) * outfitPiece.giaTien * element.quantity;
            if (giamGia > thisPro.giamToiDa) {
                discount += thisPro.giamToiDa;
            } else {
                discount += giamGia;
            }
        })
        if (promotionCode.check) {
            let value = promotionCode.promotion.donVi == "PERCENT" ? (promotionCode.promotion.giaTriGiam / 100) * (totalPrice.value - discount) : promotionCode.promotion.giaTriGiam;
            if (value > promotionCode.promotion.giamToiDa)
                value = promotionCode.promotion.giamToiDa;
            discount += value;
        }
        if (paymentPromotion.value.length > 0) {
            let totalTemp = totalPrice.value - discount;
            let promo = paymentPromotion.value.filter(promotion => cartCount.value >= promotion.soLuongToiThieu && totalTemp >= promotion.giaTriToiThieu);
            if (promo.length > 0) {
                let max = {
                    price: 0,
                    item: ""
                }
                promo.forEach(item => {
                    let current = item.giamTien + (item.phanTramGiam / 100) * totalTemp;
                    if (current > max.price) {
                        max.item = item;
                        max.price = current;
                    }
                })
                myPaymentPromotion.value = max.item;
                discount += max.price > max.item.giamToiDa ? max.item.giamToiDa : max.price;
            } else {
                myPaymentPromotion.value = null;
            }
        }
        return discount;
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
    return { promotion, paymentPromotion, promotionCode, myPromotion, totalDiscount, myPaymentPromotion, checkPromotion, loadPromotionInstance, paymentPromotionInstance }
});