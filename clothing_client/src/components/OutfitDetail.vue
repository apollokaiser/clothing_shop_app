<script setup>
import { computed, onBeforeMount, reactive, ref, toRaw, watch } from "vue";
import { getOutFitDetail } from "@/data.function/getData";
import convertToVND from "@/utils/convertVND";
import { sortSizes } from "@/utils/util.function";
import { useCartStore } from "@/stores/cart.store";
const cart = useCartStore();
const outfit = ref();
const phanLoai = ref([]);
const checkAll = ref(false);
const outfitDisplay = reactive({
    name: "",
    display: {}
});
const quickview = ref(false);
const checkOutFit = reactive({
    id: "",
    checkSize: null,
    quantity: 1,
    full: false,
});
const handleQuantity = {
    add: () => {
        if (checkOutFit.quantity < outfitDisplay.display.soLuong) {
            checkOutFit.quantity++;
        } else {
            alert("Số lượng đã vượt quá !!")
            checkOutFit.quantity = outfitDisplay.display.soLuong;
        }
    },
    reduce: () => {
        if (checkOutFit.quantity > 1) {
            checkOutFit.quantity--;
        } else {
            checkOutFit.quantity = 1;
        }
    }
}
const checkSizeCommand = (id) => {
    checkOutFit.checkSize = id;
};
const props = defineProps({
    id: {
        type: String,
        required: true,
    },short: {
        type: Boolean,
        required: false,
    },
    details: {
        type: Object,
        required: false,
    }
});
onBeforeMount(() => {
    if (props.short == false) quickview.value = true;
    if (props.details) {
        outfit.value = props.details;
        outfitDisplay.name = outfit.value.tenTrangPhuc;
        outfitDisplay.display = outfit.value;
        phanLoai.value = outfit.value.phuKiens;
    } else {
        getOutFitDetail(props.id).then((res) => {
            outfit.value = res;
            outfitDisplay.name = outfit.value.tenTrangPhuc;
            outfitDisplay.display = outfit.value;
            phanLoai.value = outfit.value.phuKiens;
        });
    }
});
watch(
    () => checkOutFit.quantity,
    (value) => {
        if (value > outfitDisplay.display.soLuong) {
            checkOutFit.quantity = outfitDisplay.display.soLuong;
        } else if (value < 1) {
            checkOutFit.quantity = 1;
        }
    }
);
watch(
    () => outfitDisplay.display,
    (value) => {
        console.log("log here");
        if (value.kichThuocs)                            
            value.kichThuocs = sortSizes(value.kichThuocs);//NOTE: sort lại kích thước theo thứ tự
        checkOutFit.id = value.id;
        checkOutFit.checkSize = outfitDisplay.display.kichThuocs?.length == 1 ? outfitDisplay.display.kichThuocs[0].maKichThuoc : null;
        checkOutFit.full = outfit.value.id == value.id && checkAll.value ? true : false;
    }
)
const hasAccessory = computed(() => {
    if (outfit.value.phuKiens)
        return toRaw(outfit.value.phuKiens).length > 0;
    return false;
});
const showSize = computed(() => {
    if (outfitDisplay.display.kichThuocs)
        return toRaw(outfitDisplay.display.kichThuocs).length > 0;
    return false;
})
const chooseOutfitHandle = (id) => {
    if (id == outfit.value.id){
        outfitDisplay.display = outfit.value;
        checkOutFit.full = false;
    }
    else
        outfitDisplay.display = phanLoai.value.find(item => item.id == id)
    checkAll.value = false;
     // chon 1 cai --> chon het bi huy
}
const uncheckedOutFitHandle = () => {
    outfitDisplay.display = outfit.value
    checkAll.value = true; // dbclick vào bất kỳ --> check tất cả
    checkOutFit.full = true;
}
const addCart = () => {
    if (checkOutFit.checkSize == null && outfitDisplay.display.kichThuocs.length > 0) {
        alert("Vui lòng chọn kích cỡ trang phục muốn thuê ! ");
    } else {
        cart.addCart({
            id: checkOutFit.id,
            size: checkOutFit.checkSize,
            quantity: checkOutFit.quantity,
            full: checkOutFit.full,
        }, outfitDisplay.display
    )
    }
}
const activeAcessory = computed(() => {
    if (checkAll.value == true) {
        return true;
    } else {
        if (outfit.value.id == outfitDisplay.display.id) {
            return 999;
        }
        return outfitDisplay.display.id;
    }
})
const price = computed(() => {
    if(!outfitDisplay.display.giaTien) return "Đang cập nhật"
    let price = outfitDisplay.display.giaTien;
    if (checkOutFit.full==true) {
        price = outfitDisplay.display.giaTronBo;
    }
    return convertToVND(price);
})
</script>

<template>
    <div class="outfit-detail container">
        <div class="outfit-detail-container p-2">
            <div class="outfit-detail-img col-lg-4 col-sm-7 col-xm-12">
                <div class="outfit-preview-img">
                    <div class="outfit-img">
                        <img v-for="item in outfit.hinhAnhs" :key="item" :src="item" alt="" />
                    </div>
                    <div class="slide-btn next-img">
                        <i class="fa fa-chevron-right" aria-hidden="true"></i>
                    </div>
                    <div class="slide-btn prev-img">
                        <i class="fa fa-chevron-left" aria-hidden="true"></i>
                    </div>
                </div>

                <div class="outfit-carousel-img">
                    <div v-for="item in outfit.hinhAnhs" :key="item" class="outfit-carousel-item">
                        <img :src="item" alt="preview 1" />
                    </div>
                </div>
            </div>
            <div class="outfit-detail-content">
                <div class="detail-content flex-column col-lg-7 col-sm-10">
                    <div class="outfit-title">
                        <h3>
                            {{
                                outfitDisplay.name ||
                                "Outfit Phối Sẵn - (Quần Bạc Bóng phối Áo Ống Bạc)"
                            }}
                        </h3>
                    </div>
                    <div class="outfit-notification mt-3">
                        <div class="outfit-status">
                            <span>Tình trạng: </span>
                            <span class="status-notice ps-1">Đang kinh doanh</span>
                        </div>
                        <div class="outfit-stock">
                            <span>Số lượng: </span>
                            <span class="stock-notice ps-1">{{ outfitDisplay.display.soLuong }}</span>
                        </div>
                    </div>
                    <div class="outfit-price col-sm-6 d-flex align-items-baseline">
                        <span>Giá:</span>
                        <span>{{price }}</span>
                    </div>
                    <!--size-->
                    <div v-if="showSize" class="outfit-size col-sm-12 d-flex align-items-baseline">
                        <span>Kích thước:</span>
                        <div class="outfit-size-box">
                            <div v-for="size in outfitDisplay.display.kichThuocs" :key="size.id" class="size-item">
                                <input hidden type="radio" :id="'size-' + size.maKichThuoc" name="check_size"
                                    :value="size.maKichThuoc" />
                                <label :for="'size-' + size.maKichThuoc"
                                    :class="{ sd: checkOutFit.checkSize == size.maKichThuoc }"
                                    @click="checkSizeCommand(size.maKichThuoc)">
                                    {{ size.maKichThuoc }}
                                    <i class="fa fa-check" aria-hidden="true"></i>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div v-if="hasAccessory || outfit.tenPhanLoai"
                        class="outfit-accessory col-sm-12 d-flex align-items-baseline">
                        <span>Phân loại:</span>
                        <div class="select-accessory">
                            <div v-if="outfit.tenPhanLoai" @click="chooseOutfitHandle(outfit.id)"
                                @dblclick="uncheckedOutFitHandle" class="accessory-item"
                                :class="{ active: activeAcessory == true || activeAcessory == 999 }">{{ outfit.tenPhanLoai }}
                            </div>
                            <div v-if="outfit.phoiSan" :class="{ 'check-type': outfitDisplay.display.id == outfit.id }"
                                class="accessory-item">Trọn bộ</div>
                            <div v-for="phuKien in outfit.phuKiens" :key="phuKien.id" @click="chooseOutfitHandle(phuKien.id)"
                                @dblclick="uncheckedOutFitHandle" class="accessory-item"
                                :class="{ active: phuKien.id == activeAcessory || activeAcessory == true }">
                                {{ phuKien.tenTrangPhuc }}
                            </div>
                        </div>
                    </div>
                    <div class="outfit-quatity col-sm-12 d-flex align-items-baseline">
                        <span>Số lượng:</span>
                        <div class="number-control">
                            <div class="number-left" @click="handleQuantity.reduce"></div>
                            <input v-model="checkOutFit.quantity" type="number" name="number" class="number-quantity" />
                            <div class="number-right" @click="handleQuantity.add"></div>
                        </div>
                    </div>
                    <div class="outfit-add-cart col-sm-12 d-flex justify-content-evenly align-items-baseline">
                        <button @click.prevent="addCart" class="btn">THÊM VÀO GIỎ</button>
                        <button class="btn">THUÊ NGAY</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!quickview" class="outfit-description">
            <div class="des-title-box">
                <div class="des-title">MÔ TẢ SẢN PHẨM</div>
            </div>
            <div class="des-content">{{ outfit.moTa }}</div>
        </div>
    </div>
</template>

<style scoped>
.outfit-detail-container {
    display: flex;
    width: 90%;
    flex-wrap: wrap;
}

.outfit-detail-container .outfit-detail-img {
    padding: 3px;
    overflow: hidden;
    cursor: pointer;
}

.outfit-preview-img {
    position: relative;
    overflow: hidden;
    padding: 0px 10px 10px 10px;
}

.outfit-detail-container .outfit-detail-img .outfit-img img {
    transition: all 0.5s ease;
    object-fit: cover;
    padding: 20px;
}

.outfit-img {
    display: flex;
    flex-wrap: nowrap;
}

.outfit-img:hover {
    transform: translateX(-100%);
}

.slide-btn {
    position: absolute;
    top: 50%;
    font-size: 18px;
}

.slide-btn.next-img {
    right: 0%;
    transition: all 0.5s;
}

.slide-btn.prev-img {
    left: 0%;
    transition: all 0.5s;
}

.outfit-detail-img:hover .slide-btn.next-img,
.outfit-detail-img:hover .slide-btn.prev-img {
    transform: scale(1.4);
}

.outfit-carousel-img {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 100%;
    height: auto;
}

.outfit-carousel-img .outfit-carousel-item {
    padding: 3px;
    border: 1px solid #ccc;
    width: 20%;
    overflow: hidden;
    border-radius: 5px;
}

.outfit-carousel-img .outfit-carousel-item img {
    object-position: center;
    object-fit: cover;
}

.outfit-detail-content {
    padding: 20px;
    border-left: 1px solid #ccc;
    margin-left: 20px;
    flex: 1 1 auto;
}

.outfit-title {
    font-weight: bold;
    text-align: left;
    word-break: keep-all;
}

.outfit-title h3 {
    font-size: 20px;
}

.outfit-price>span:first-child,
.outfit-accessory>span:first-child,
.outfit-quatity>span:first-child,
.outfit-size>span:first-child {
    min-width: 120px;
    font-weight: bold;
}

.outfit-price>span:last-child {
    font-size: 27px;
    font-weight: bold;
    color: red;
    margin-top: 25px;
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}

.select-accessory,
.outfit-size-box {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 30px;
}

.outfit-size-box .size-item {
    position: relative;
    display: inline-block;
    margin-right: 5px;
}

.size-item i {
    display: none;
    position: absolute;
    bottom: 0;
    right: 0;
    color: rgb(252, 70, 100);
}

.outfit-size-box .size-item label {
    min-width: 35px !important;
    height: 35px;
    text-align: center;
    line-height: 35px;
    white-space: nowrap;
    font-size: 12px;
    border: 1px solid #ccc;
    cursor: pointer;
    position: relative;
    padding: 0 10px;
}

.outfit-size-box .size-item .sd {
    border: 2px solid rgb(252, 70, 100);
}

.outfit-size-box .size-item .sd i {
    display: inline-block;
}

.select-accessory .accessory-item {
    padding: 5px 15px;
    margin: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: rgb(252, 70, 100);
}

.select-accessory .accessory-item.active {
    border: 1px solid rgb(252, 70, 100);
}

.outfit-quatity {
    margin-top: 30px;
}

/* .number-control {
    display: flex;
    align-items: center;
}

.number-left::before,
.number-right::after {
    content: attr(data-content);
    background-color: #fffafa;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border: 1px solid #a4aaaf;
    width: 25px;
    color: black;
    transition: background-color 0.3s;
    cursor: pointer;
}

.number-left::before {
    content: "-";
}

.number-right::after {
    content: "+";
}

.number-quantity {
    text-align: center;
    padding: 0.25rem;
    border: 0;
    width: 70px;
    -moz-appearance: textfield;
    border-top: 1px solid #a4aaaf;
    border-bottom: 1px solid #a4aaaf;
}

.number-left:hover::before,
.number-right:hover::after {
    background-color: #666666;
    color: #fff;
} */

.outfit-add-cart {
    margin-top: 50px;
    flex-wrap: wrap;
}

.btn {
    color: purple;
    text-transform: uppercase;
    text-decoration: none;
    border: 2px solid purple;
    padding: 10px 20px;
    font-size: 17px;
    font-weight: bold;
    background: transparent;
    position: relative;
    transition: all 1s;
    overflow: hidden;
}

.btn:hover {
    color: white;
}

.btn::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 0%;
    top: 0;
    left: -40px;
    transform: skewX(45deg);
    background-color: purple;
    z-index: -1;
    transition: all 1s;
}

.btn:hover::before {
    width: 160%;
}

.outfit-description {
    margin: 50px 0;
}

.outfit-description .des-title-box {
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
}

.outfit-description .des-title-box .des-title {
    padding: 0 0 10px 0;
    border-bottom: 2px solid black;
    display: inline-block;
    text-transform: uppercase;
}

.outfit-description .des-content {
    text-align: justify;
    word-break: keep-all;
    margin: 30px 0;
}

.outfit-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
}
</style>
