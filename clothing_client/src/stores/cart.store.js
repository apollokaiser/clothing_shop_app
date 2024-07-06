import { defineStore, storeToRefs } from "pinia";
import { ref, computed, watch } from "vue";
import { getCart, getCartItems } from "@/data.function/getData";
import { saveCart } from "@/data.function/postData";
import { authStore } from "./user.store";
export const useCartStore = defineStore("cart", () => {
    const auth = authStore();
    const { isLoggedIn, user } = storeToRefs(auth);
    const cartItems = ref([])
    const cartDetail = ref([])
    let updateTimer = null;
    const deleteCartItems = ref([])
    const insertCartItems = ref([])
    const totalPrice = computed(() => {
        if (cartItems.value.length > 0 && cartDetail.value.length > 0) {
            let total = 0;
            cartItems.value.forEach((item) => {
                if (item.check) {
                    let cart = cartDetail.value?.find(cart => cart.id == item.id);
                    total += item.quantity * (!item.full ? cart.giaTien : cart.giaTronBo);
                }
            })
            return total;

        }
        return 0;
    })
    const cartCount = computed(()=>{
        if(cartItems.value.length > 0) {
        return cartItems.value.map(item=>item.quantity).reduce((total, item)=>total + item);
        }
        return 0;
    })
    //UPDATED: Fix lỗi khi remove cart item thì watch được gọi dẫn đến cart item được gán = response, vốn dĩ watch này chỉ được gọi khi mới load trang 
    watch(() => user.value.gioHangs, (value) => {
        if (value && user.value.gioHangs > 0 && cartItems.value.length == 0) {
            getCart(user.value.uid).then((response) => {
                if (response) {
                    response.cart_items.forEach(element => {
                        element.check = true;
                        element.promotion = null;
                        element.discount = 0
                    })
                    cartItems.value = response.cart_items;
                    cartDetail.value = response.cart_details;
                    localStorage.setItem("CART_", JSON.stringify({ cart: cartItems.value, state: isLoggedIn.value }))
                }
            })
        }
    })
    watch(insertCartItems, (value) => {
        if (value.length > 0) {
            if (updateTimer) clearTimeout(updateTimer)
            updateTimer = setTimeout(() => {
                saveCart(user.value.uid, insertCartItems.value, deleteCartItems.value).then(response => {
                    if (response) {
                        insertCartItems.value = []
                        deleteCartItems.value = []
                    }
                })
            }, 2000)
        }

    }, {
        deep: true
    })
    watch(deleteCartItems, (value) => {
        if (value.length > 0) {
            if (updateTimer) clearTimeout(updateTimer)
            updateTimer = setTimeout(() => {
                saveCart(user.value.uid, insertCartItems.value, deleteCartItems.value).then(response => {
                    if (response) {
                        insertCartItems.value = []
                        deleteCartItems.value = []
                    }

                })
            }, 2000)
        }
    }, {
        deep: true
    })
    const addCart = (cartItem, detail = null, auto_increasement = false) => {
        const index = cartItems.value.findIndex(item => item.id === cartItem.id && item.size == cartItem.size);
        const cart = new Cart(cartItem.id, cartItem.quantity, cartItem.size, cartItem.full, cartItem.check, cartItem.promotion)
        if (index != -1) {
            if (auto_increasement)
                cartItems.value.at(index).quantity = cartItem.quantity;
            else
            cartItems.value.at(index).quantity += cartItem.quantity;
    } else {
            cartItems.value.push(cart);
            cartDetail.value.push(detail);
            user.value.gioHangs++;
        }
        if (isLoggedIn.value) {
            insertCartItems.value.push(cart)
        }
        localStorage.setItem('CART_', JSON.stringify({ cart: cartItems.value, state: isLoggedIn.value }))
    }
    //NOTE: hàm này chỉ được dùng khi thay đổi size
    /**
     * @param {Array} cartItem trang phục muốn thay đổi size
     * @param {String} size kích cỡ muốn thay đổi
     */
    const changeCartItemSize = (cartItem, oldSize) => {
        // const index = cartItems.value.findIndex(item => item.id === cartItem.id && item.size == oldSize);
        // if (index != -1) {
        // cartItems.value.splice(index, 1, cartItem);
        if (isLoggedIn.value) {
            insertCartItems.value.push(cartItem);
            deleteCartItems.value.push({ ...cartItem, size: oldSize });
        }
        // }
        localStorage.setItem('CART_', JSON.stringify(cartItems.value))
    }
    const removeCart = (outfitId, size, full) => {
        const index = cartItems.value.findIndex(item => item.id === outfitId && item.size == size);
        if (index != -1) {
            if (isLoggedIn.value){
                user.value.gioHangs--;
                deleteCartItems.value.push(cartItems.value.at(index));
            }
            cartItems.value.splice(index, 1);
        }
        localStorage.setItem('CART_', JSON.stringify(cartItems.value))
        if (cartItems.value.length == 0)
            localStorage.removeItem('CART_')
    }
    const checkCart = (cartItem) => {
        const index = cartItems.value.findIndex(item => item.id === cartItem.id && item.size == cartItem.size && item.full == cartItem.full);
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
        const cartLocal = JSON.parse(localStorage.getItem('CART_'))
        if (cartLocal) {
            if (cartLocal.state == false) {      //chưa đăng nhập
                cartItems.value = cartLocal.cart;
                getCartItems(cartLocal.cart).then(response => {
                    cartDetail.value = response;
                })
            }
            if (cartLocal.state == true && isLoggedIn.value) {
                localStorage.removeItem("CART_");
            }
        }
    }
    const clearCart = () => {
        deleteCartItems.value = cartItems.value.filter(item => item.check);
        user.value.gioHangs = 0;
        cartItems.value = cartItems.value.filter(item => !item.check) || [];
        if (cartItems.value.length == 0)
            localStorage.removeItem('CART_')
    }
    return { cartItems, totalPrice, cartDetail,cartCount, loadCartInstance, addCart, removeCart, checkCart, changeCartItemSize, clearCart }
})

class Cart {
    constructor(outfitId, quantity, outfitSize, full, check = true, promotion = null, discount = 0) {
        this.id = outfitId
        this.quantity = quantity
        this.size = outfitSize
        this.full = full
        this.check = check
        this.promotion = promotion
        this.discount = discount
    }
}