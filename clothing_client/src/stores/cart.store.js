import { defineStore, storeToRefs } from "pinia";
import { ref, computed, watch } from "vue";
import { getCart, getCartItems } from "@/data.function/getData";
import { saveCart } from "@/data.function/postData";
import { authStore } from "./user.store";
import { Toast } from "@/utils/notification";
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
                    let outfitCart = null;
                    let mainOutfit = cartDetail.value?.find(main => main.id == item.parentId);
                    if(item.id == item.parentId) {
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
    const cartCount = computed(()=>{
        if(cartItems.value.length > 0) {
        return cartItems.value.map(item=>item.quantity).reduce((total, item)=>total + item);
        }
        return 0;
    })
    //UPDATED: Fix lỗi khi remove cart item thì watch được gọi dẫn đến cart item được gán = response, vốn dĩ watch này chỉ được gọi khi mới load trang 
    watch(() => user.value.gioHangs, (value) => {
        if (value && user.value.gioHangs > 0) {
            getCart(user.value.uid).then((response) => {
                if (response) {
                    response.cart_items.forEach(element => {
                        element.check = true;
                        element.promotion = null;
                        element.validPromoCode = null;
                        element.discount = 0
                    })
                    cartItems.value = response.cart_items;
                    cartDetail.value = response.cart_details;
                    localStorage.setItem("CART_", JSON.stringify( cartItems.value))
                }
            })
        }
    })
    watch(()=> user.value.email, (newValue, oldValue)=>{
        if(oldValue !="" && newValue =="") clearCart();
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
    watch(cartDetail, value=>{
        if(value.length > 0) {
           cartItems.value.forEach(item=>{
            let mainOutfit =  cartDetail.value.find(main => main.id == item.parentId);
            let outfitPiece = null;
            if(item.id == item.parentId) {
                outfitPiece = mainOutfit;
            } else {
                outfitPiece = mainOutfit.manhTrangPhucs.find(outfit => outfit.id == item.id);
            }
            let disabledSize = outfitPiece.kichThuocs.filter(size=>size.soLuong ==0).map(size => size.maKichThuoc);
            if(disabledSize.includes(item.size)) {
                item.check = false;
            }
           })
        }
    },{
        deep: true
    })
    //FIXME: chỉnh sửa lại detai cho giống cấu trúc của outfitCart
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
            user.value.gioHangs++;
        }
        if (isLoggedIn.value) {
            insertCartItems.value.push(cart)
        }
        localStorage.setItem('CART_', JSON.stringify(cartItems.value))
    }
    //NOTE: hàm này chỉ được dùng khi thay đổi size
    /**
     * @param {Array} cartItem trang phục muốn thay đổi size
     * @param {String} size kích cỡ muốn thay đổi
     */
    const changeCartItemSize = (cartItem, oldSize) => {
        if (isLoggedIn.value) {
            insertCartItems.value.push(cartItem);
            deleteCartItems.value.push({ ...cartItem, size: oldSize });
        }
        const index = cartItems.value.findIndex(item => item.id === cartItem.id && item.size == oldSize);
        if(index !== -1) {
                cartItems.value.at(index).size = cartItem.size;
        // }
        localStorage.setItem('CART_', JSON.stringify(cartItems.value))
    }
}
    const changeCartItemId = (cartItem, oldId, size) => {
        if (isLoggedIn.value) {
            insertCartItems.value.push(cartItem);
            deleteCartItems.value.push({ ...cartItem, id: oldId });
        }
        const index = cartItems.value.findIndex(item => item.id === oldId && item.size == size);
        if(index !== -1) {
            let thisDetail = cartDetail.value.find(item=> item.id == cartItem.parentId);
            let replacePiece = thisDetail.manhTrangPhucs.find(item=> item.id == cartItem.id);
            if(replacePiece.kichThuocs.every(size => size.soLuong==0)) {
                Toast.fire({
                    icon: 'error',
                    title: 'Trang phục này đã hết hàng!'
                })
                return;
            } else {
                cartItems.value.at(index).id = cartItem.id;
                cartItems.value.at(index).size = replacePiece.kichThuocs.find(size=> size.soLuong !=0)?.maKichThuoc;
                cartItems.value.at(index).quantity = 1;
            }
        }
        // }
        localStorage.setItem('CART_', JSON.stringify(cartItems.value))
    }
    const changeStatus = (id,size, status)  => {
        const index = cartItems.value.findIndex(item => item.id === id && item.size == size);
        if (index!= -1) {
            cartItems.value.at(index).check = status;
        }
    }
    const removeCart = (outfitId, size) => {
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
        cartItems.value = JSON.parse(localStorage.getItem('CART_'))
        if ( cartItems.value) {
                getCartItems(cartItems.value).then(response => {
                    cartDetail.value = response;
                })
        }
    }
    const clearCart = () => {
        deleteCartItems.value = cartItems.value.filter(item => item.check);
        user.value.gioHangs = 0;
        cartItems.value = cartItems.value.filter(item => !item.check) || [];
        if (cartItems.value.length == 0)
            localStorage.removeItem('CART_')
    }
    return { cartItems, totalPrice, cartDetail,cartCount, loadCartInstance, addCart, removeCart, checkCart, changeCartItemSize, clearCart,changeCartItemId,changeStatus }
})

class Cart {
    constructor(outfitId, quantity, size, parentId, check = true, promotion = null, discount = 0, validPromoCode=null) {
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