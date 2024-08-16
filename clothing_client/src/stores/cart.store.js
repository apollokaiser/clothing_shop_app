import { defineStore, storeToRefs } from "pinia";
import { ref, computed, watch } from "vue";
import { canceledOrder, getCart, getCartItems } from "@/data.function/getData";
import { addCart as insertCart, updateCart, updateOutfitInCart, deleteCart } from "@/data.function/postData";
import { authStore } from "./user.store";
import { useRouter } from "vue-router";
import { Toast } from "@/utils/notification";
import { convertToSlug } from "@/utils/util.function";
export const useCartStore = defineStore("cart", () => {
    const router = useRouter();
    const auth = authStore();
    const { isLoggedIn, user } = storeToRefs(auth);
    const cartItems = ref([])
    const cartDetail = ref([])
    const preOrder = ref({});
    let updateTimer = null;
    const deleteCartItems = ref({})
    const insertCartItems = ref({})
    const totalPrice = computed(() => {
        if (cartItems.value.length > 0 && cartDetail.value.length > 0) {
            let total = 0;
            cartItems.value.forEach((item) => {
                if (item.check) {
                    let outfitCart = null;
                    let mainOutfit = cartDetail.value?.find(main => main.id == item.parentId);
                    if (item.id == item.parentId) {
                        outfitCart = mainOutfit;
                    } else {
                        outfitCart = mainOutfit.manhTrangPhucs.find(outfit => outfit.id == item.id);
                    }
                    total += item.quantity * outfitCart?.giaTien;
                }
            })
            return total;

        }
        return 0;
    })
    const cartCount = computed(() => {
        return cartItems.value.length > 0 ? cartItems.value.map(item => item.quantity).reduce((total, item) => total + item) : 0;

    })
    const getCartInstance = (value) =>{
        getCart(value).then((response) => {
            if (response) {
                response.cart_items.forEach(element => {
                    element.check = true;
                    element.promotion = null;
                    element.validPromoCode = null;
                    element.discount = 0
                })
                cartItems.value = response.cart_items;
                cartDetail.value = response.cart_details;
                if(response.prepare_cart && response.prepare_cart.carts.length >0) {
                    preOrder.value = response.prepare_cart;
                    // router.push({name:"order-confirm", params:{uid:value, slug:convertToSlug(user.value.name)}})
                }
            }
        })
    }
    //UPDATED: Fix lỗi khi remove cart item thì watch được gọi dẫn đến cart item được gán = response, vốn dĩ watch này chỉ được gọi khi mới load trang 
    //UPDATED: Cập nhật fix UPDATED phía trên, watcher này bây giờ sẽ được listenter mỗi khi có sự thay đổi trang phục trong giỏ hàng (cả insert và update), trừ trường hợp chỉnh sửa các thông tin mà không làm thay đổi số lượng sản phẩm cart
    watch(() => user.value.uid, (value) => {
        console.log(value);
        if(value){
            getCartInstance(value);
        }
    })
    watch(() => user.value.email, (newValue, oldValue) => {
        if (oldValue != "" && newValue == "") clearCart();
    })
    watch(insertCartItems, async (value) => {
        if (value && value != "") {
            const response = await insertCart(value)
            if (response) {
                //UPDATED: thay đổi số lượng giỏ hàng chỉ khi add cart thực hiện xong xong
                user.value.gioHangs++;
                insertCartItems.value = "";
                deleteCartItems.value = "";
            }
        }

    }, {
        deep: true
    })
    watch(deleteCartItems, (value) => {
        if (value && value != "") {
            deleteCart(deleteCartItems.value).then(response => {
                if (response) {
                    //UPDATED: thay đổi số lượng giỏ hàng chỉ khi remove cart thực hiện xong xong
                    user.value.gioHangs--;
                    insertCartItems.value = ""
                    deleteCartItems.value = ""
                }
            })
        }
    }, {
        deep: true
    })
    //NOTE: Watcher này sẽ listen để kiểm tra những trang phục nào trong giỏ hàng đang bị tạm hết và chuyển check = false
    watch(cartDetail, value => {
        if (value.length > 0) {
            cartItems.value.forEach(item => {
                let mainOutfit = cartDetail.value.find(main => main.id == item.parentId);
                let outfitPiece = null;
                if (item.id == item.parentId) {
                    outfitPiece = mainOutfit;
                } else {
                    outfitPiece = mainOutfit.manhTrangPhucs.find(outfit => outfit.id == item.id);
                }
                let thisSize = outfitPiece.kichThuocs.find(size=> size.maKichThuoc == item.size)
                if(thisSize && item.quantity > thisSize.soLuong) {
                    item.quantity = thisSize.soLuong;
                }
                let disabledSize = outfitPiece.kichThuocs.filter(size => size.soLuong == 0).map(size => size.maKichThuoc);
                if (disabledSize.includes(item.size)) {
                    item.check = false;
                }
            })
        }
    }, {
        deep: true
    })
    //UPDATED: chỉnh sửa lại detail cho giống cấu trúc của outfitCart
    const addCart = (cartItem, detail = null, auto_increasement = false) => {
        const index = cartItems.value.findIndex(item => item.id === cartItem.id && item.size == cartItem.size);
        const cart = new Cart(cartItem.id, cartItem.quantity, cartItem.size, cartItem.parentId, cartItem.check, cartItem.promotion, cartItem.validPromoCode)
        if (index != -1) {
            if (auto_increasement)
                cartItems.value.at(index).quantity = cartItem.quantity;
            else
                cartItems.value.at(index).quantity += cartItem.quantity;
        } else {
            cartItems.value.push(cart);
            cartDetail.value.push(detail);
        }
        if (isLoggedIn.value) {
            insertCartItems.value = cart;
        }
        localStorage.setItem('CART_', JSON.stringify(cartItems.value))
    }
    //NOTE: hàm này chỉ được dùng khi thay đổi size
    /**
     * @param {Array} cartItem thông tin thay đổi
     * @param {String} oldSize kích cỡ trước khi thay đổi
     */
    const changeCartItemSize = (cartItem, oldSize) => {
        if (isLoggedIn.value) {
            // insertCartItems.value = cartItem;
            if (updateTimer) clearTimeout(updateTimer);
            updateTimer = setTimeout(() => {
                updateCart(cartItem)
                    .then(result => {
                        if (!result) {
                            // chỉ update size nếu update thành công, nếu result bị lỗi thì trả về giá trị cũ
                            const index = cartItems.value.findIndex(item => item.id === cartItem.id && item.size == cartItem.size);
                            if (index !== -1) {
                                cartItems.value.at(index).size = oldSize;
                                // }
                                localStorage.setItem('CART_', JSON.stringify(cartItems.value))
                            }
                        }
                    }
                    )
            }, 1300)
        }
        const index = cartItems.value.findIndex(item => item.id === cartItem.id && item.size == cartItem.oldSize);
        if (index !== -1) {
            cartItems.value.at(index).size = cartItem.size;
            localStorage.setItem('CART_', JSON.stringify(cartItems.value))
        }
    }
    const changeCartItemId = (cartItem, oldId, size, newId = null) => {
        if (isLoggedIn.value) {
            if (updateTimer) clearTimeout(updateTimer);
            updateTimer = setTimeout(() => {
                updateOutfitInCart(cartItem, { ...cartItem, id: oldId }).then(result => result)
            }, 1300)
        }
        const index = cartItems.value.findIndex(item => item.id === oldId && item.size == size);
        if (index !== -1) {
            let thisDetail = cartDetail.value.find(item => item.id == cartItem.parentId);
            let replacePiece = thisDetail.manhTrangPhucs.find(item => item.id == newId);
            if (replacePiece.kichThuocs.every(size => size.soLuong == 0)) {
                Toast.fire({
                    icon: 'error',
                    title: 'Trang phục này đã hết hàng!'
                })
                if(newId)
                    cartItems.value.at(index).id = oldId;
                return;
            } else {
                cartItems.value.at(index).id = newId;
                cartItems.value.at(index).size = replacePiece.kichThuocs.find(size => size.soLuong != 0)?.maKichThuoc;
                cartItems.value.at(index).quantity = 1;
            }
        }
        // }
        localStorage.setItem('CART_', JSON.stringify(cartItems.value))
    }
    const changeStatus = (id, size, status) => {
        const index = cartItems.value.findIndex(item => item.id === id && item.size == size);
        if (index != -1) {
            cartItems.value.at(index).check = status;
        }
    }
    const removeCart = (outfitId, size) => {
        const index = cartItems.value.findIndex(item => item.id === outfitId && item.size == size);
        if (index != -1) {
            if (isLoggedIn.value) {
                deleteCartItems.value = cartItems.value.at(index)
            }
            cartItems.value.splice(index, 1);
        }
        localStorage.setItem('CART_', JSON.stringify(cartItems.value))
        if (cartItems.value.length == 0)
            localStorage.removeItem('CART_')
    }
    //DESC dùng để thay đổi trạng thái check và uncheck của trang phục trong giỏ hàng
    const checkCart = (cartItem) => {
        const index = cartItems.value.findIndex(item => item.id === cartItem.id && item.size == cartItem.size);
        if (index != -1) {
            cartItems.value.at(index).check = cartItem.check;
        }
        localStorage.setItem('CART_', JSON.stringify(cartItems.value))
    }
    //NOTE: TEST BY LOCAL
    const loadCartInstance = () => {
        if (cartItems.value.length > 0) {
            getCartItems(cartItems.value).then(response => {
                cartDetail.value = response;
            })
            return;
        }
        cartItems.value = JSON.parse(localStorage.getItem('CART_')) ? JSON.parse(localStorage.getItem('CART_')) : [];
        if (cartItems.value) {
            getCartItems(cartItems.value).then(response => {
                cartDetail.value = response;
            })
        }
    }
    const clearCart = () => {
        let deleteItems = cartItems.value.filter(item => item.check);
        user.value.gioHangs = user.value.gioHangs - deleteItems.length;
        cartItems.value = cartItems.value.filter(item => !item.check) || [];
        if (cartItems.value.length == 0)
            localStorage.removeItem('CART_')
    }
    const cancelPreOrder = () =>{
        preOrder.value = {};
        canceledOrder().then(res=>res);
    }
    return { cartItems, totalPrice, cartDetail, cartCount,preOrder, loadCartInstance, addCart, removeCart, checkCart, changeCartItemSize, clearCart, changeCartItemId, changeStatus,getCartInstance,cancelPreOrder }
})

class Cart {
    constructor(outfitId, quantity, size, parentId, check = true, promotion = null, discount = 0, validPromoCode = null) {
        this.id = outfitId
        this.quantity = quantity
        this.size = size
        this.parentId = parentId
        this.check = check
        this.promotion = promotion
        this.discount = discount
        this.validPromoCode = validPromoCode || null;
    }
}