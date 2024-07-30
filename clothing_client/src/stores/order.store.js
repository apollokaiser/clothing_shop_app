import { defineStore, storeToRefs } from "pinia";
import {ref, watch} from 'vue'
import { useCartStore } from "./cart.store";
import { usePromotionStore } from "./promotion.store";
export const useOrderStore = defineStore("order", () => {
    const orderDetail = ref([])
    const cart = useCartStore()
    const khuyenMai = usePromotionStore()
    const {totalPrice} = storeToRefs(cart);
    const {totalDiscount, promotionCode} = storeToRefs(khuyenMai);
    const address = ref("");
    const order = ref({
        tenNguoiNhan:"",
        sdtNguoiNhan:"",
        diaChiNguoiNhan:"",
        ngayThue:"",
        ngayNhan:"",
        tamTinh:0,
        tongUuDai:0,
        tongThue:0,
        maKhuyenMai:""
    })
watch(totalPrice, value=>{
    order.value.tamTinh = value == 0 ? 0 :value;
}, {
    immediate: true,
    deep: true
})
watch(promotionCode, (value)=>{
    if(value.check && value.code !="") {
        order.value.maKhuyenMai = value.code;
    }
},{
    deep:true,
    immediate: true,
})
watch(totalDiscount, value=>{
    order.value.tongUuDai = value == 0? 0 : value;
})
    return {orderDetail,address, order };
});

class OrderDetail {
    constructor(maTrangPhuc, soLuong, kichThuoc, toanPhan, maKhuyenMai, giaTien, giaKhuyenMai=0) {
        this.maTrangPhuc = maTrangPhuc
        this.soLuong = soLuong
        this.kichThuoc = kichThuoc
        this.toanPhan = toanPhan
        this.khuyenMai = maKhuyenMai
        this.giaTien = giaTien
        this.discount = giaKhuyenMai
        this.tongTien = this.discount * this.soLuong;   
    }
}