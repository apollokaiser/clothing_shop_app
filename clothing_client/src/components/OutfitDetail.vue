<script setup>
import { computed, onBeforeMount, reactive, ref, toRaw, watch } from "vue";
import { Toast } from "@/utils/notification";
import { getOutFitDetail } from "@/data.function/getData";
import convertToVND from "@/utils/convertVND";
import { sortSizes } from "@/utils/util.function";
import { useCartStore } from "@/stores/cart.store";
import { useInitStore } from "@/stores/init.store";

const initStore = useInitStore();
const cart = useCartStore();
const carouselIndex = ref(0);
const outfit = ref();
const phanLoai = ref([]);
const quickview = ref(false);
const outfitDisplay = reactive({
    name: "",
    display: {},
});
const checkOutFit = reactive({
    id: "",
    checkSize: "NONE",
    quantity: 1,
});

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    short: {
        type: Boolean,
        required: false,
    },
    details: {
        type: Object,
        required: false,
    },
});
onBeforeMount(() => {
    initStore.addAttenttion(props.id);
    if (props.short == false) quickview.value = true;
    if (props.details) {
        outfit.value = props.details;
        outfitDisplay.name = outfit.value.tenTrangPhuc;
        if(outfit.value.manhTrangPhucs.length) {
                outfitDisplay.display = 
                                    outfit.value.manhTrangPhucs.find(item=> item.tinhTrang && item.kichThuocs.some(size=> size.soLuong != 0 && size.trangThai))
                phanLoai.value = outfit.value.manhTrangPhucs;
            } else{
                outfitDisplay.display = outfit.value;
                phanLoai.value = [];
            }
        // outfitDisplay.display = outfit.value.manhTrangPhucs?.length > 0 ? outfit.value.manhTrangPhucs[0] : outfit.value;
        // phanLoai.value = outfit.value.manhTrangPhucs?.length > 0 ? outfit.value.manhTrangPhucs : [];
    } else {
        getOutFitDetail(props.id).then((res) => {
            outfit.value = res;
            outfitDisplay.name = outfit.value.tenTrangPhuc;
            if(outfit.value.manhTrangPhucs.length) {
                outfitDisplay.display = 
                                    outfit.value.manhTrangPhucs.find(item=> item.tinhTrang && item.kichThuocs.some(size=> size.soLuong != 0 && size.trangThai))
                phanLoai.value = outfit.value.manhTrangPhucs;
            } else{
                outfitDisplay.display = outfit.value;
                phanLoai.value = [];
            }
            // outfitDisplay.display = outfit.value.manhTrangPhucs ? outfit.value.manhTrangPhucs[0] : outfit.value;
            // phanLoai.value = outfit.value.manhTrangPhucs ? outfit.value.manhTrangPhucs : [];
        });
    }
});
const outfitStatus = computed(() => {
    if (outfitDisplay.display?.tinhTrang) {
        if(outfitDisplay.display.kichThuocs.length){
            console.log("log here");
            let thisOutfit = outfitDisplay.display.kichThuocs.find(size => size.maKichThuoc == checkOutFit.checkSize);
            console.log(thisOutfit);
            if (thisOutfit?.soLuong == 0) return -1;
            else if (!thisOutfit?.trangThai) return 0;
            else return 1;
        }          
        else return 1;
    }
    else return 0;
})
const outfitSize = computed(() => {
    if (outfitDisplay.display) return outfitDisplay.display.kichThuocs.find(size => size.maKichThuoc == checkOutFit.checkSize);
    return null;
})
const hasOutfitPieces = computed(() => {
    if (outfit.value.manhTrangPhucs) return toRaw(outfit.value.manhTrangPhucs).length > 0;
    return false;
});
const showSize = computed(() => {
    if (outfitDisplay.display?.kichThuocs[0].maKichThuoc != "NONE")
        return toRaw(outfitDisplay.display.kichThuocs).length > 0;
    return false;
});
const price = computed(() => {
    if (!outfitDisplay.display?.giaTien) return "Chọn để xem";
    return convertToVND(outfitDisplay.display.giaTien);
});

// Watcher
watch(
    () => outfitDisplay.display,
    (value) => {
        if (value.kichThuocs[0].makichThuoc != "NONE") {
            //NOTE: sort lại kích thước theo thứ tự
            value.kichThuocs = sortSizes(value.kichThuocs);
            checkOutFit.checkSize = outfitDisplay.display.kichThuocs.find(size => size.soLuong != 0 && size.trangThai)?.maKichThuoc;
        } else {
            checkOutFit.checkSize = "NONE";
        }
        checkOutFit.id = value.id;
    }
);
// watch(
//     () => checkOutFit.checkSize,
//     (newValue, oldValue) => {
//         console.log(newValue, oldValue);
//         if (newValue != oldValue) {
//             console.log("diff");
//             if(outfitDisplay.display.kichThuocs.find(size=> size.maKichThuoc == newValue).soLuong == 0) {
//                 Toast.fire({
//                     icon: "error",
//                     title: "Sản phẩm đã hết hàng!"
//                 })
//                 checkOutFit.checkSize = oldValue;
//                 return;
//             }
//             checkOutFit.quantity = 1;
//         }
//     }
// );
watch(() => checkOutFit.quantity, value => {
    if (value <= 0) checkOutFit.quantity = 1;
    if (value > outfitSize.value.soLuong) {
        Toast.fire({
            icon: "error",
            title: "Số lượng quá hạn!"
        })
        checkOutFit.quantity = outfitSize.value.soLuong;
    }
})
const chooseOutfitSize = (id) => {
    console.log("log to chooseOutfitSize");
    console.log(outfitDisplay.display);
    if (!outfitDisplay.display.tinhTrang) {
        Toast.fire({
            icon: "error",
            title: "Sản phẩm đã ngừng cho thuê!"
        })
        return;
    }
    console.log(outfitDisplay.display.kichThuocs.find(item=> item.maKichThuoc == id).trangThai);
        if(!outfitDisplay.display.kichThuocs.find(item=> item.maKichThuoc == id).trangThai){
            Toast.fire({
                icon: "error",
                title: "Sản phẩm đã ngừng cho thuê!"
            })
            return;
        }
    if (outfitDisplay.display.kichThuocs.find(size => size.maKichThuoc == id).soLuong == 0) {
        Toast.fire({
            icon: "error",
            title: "Sản phẩm đã hết hàng!"
        })
    } else {
        checkOutFit.checkSize = id;
    }
}
// function
const chooseOutfitHandle = (id) => {
    let temp = phanLoai.value.find((item) => item.id == id);
    if (temp) {
        if (!temp.tinhTrang) {
            Toast.fire({
                icon: "error",
                title: "Sản phẩm đã ngừng cho thuê!"
            })
            return;
        }
        // kiểm tra hết hàng chưa
        if (temp.kichThuocs.length >= 1 && temp.kichThuocs.every(size => size.soLuong == 0)) {
            Toast.fire({
                icon: "error",
                title: "Sản phẩm đã hết hàng!"
            })
            return;
        } else {
            outfitDisplay.display = temp;
        }
    }
};
//FIXME: Thêm parentId và detail
const addCart = () => {
    //NOTE: xem lại watch của outfitDisplay.display để hiểu chi tiết 
    if (!checkOutFit.checkSize) {
        Toast.fire({
            icon: "error",
            title: "Sản phẩm đã tạm hết !"
        })
        return;
    }
    let detail = toRaw(outfit.value);
    detail.hinhAnh = outfit.value.hinhAnhs[0];
    detail.hinhAnhs = null;
    detail.moTa = null;
    cart.addCart(
        {
            id: checkOutFit.id,
            size: checkOutFit.checkSize,
            quantity: checkOutFit.quantity,
            parentId: outfit.value.id,
        },
        detail
    );
};
const cannotChoose = (item) =>{
    return !item.tinhTrang || item.kichThuocs.every(size=> size.soLuong==0 || size.trangThai== 0);
}
const handleQuantity = {
    add: () => {
        if (checkOutFit.quantity < outfitSize.value?.soLuong) {
            checkOutFit.quantity++;
        } else {
            Toast.fire({
                icon: "error",
                title: "Số lượng quá hạn !"
            })
            checkOutFit.quantity = outfitSize.value?.soLuong;
        }
    },
    reduce: () => {
        if (checkOutFit.quantity > 1) {
            checkOutFit.quantity--;
        } else {
            checkOutFit.quantity = 1;
        }
    },
};
</script>

<template>
    <div class="outfit-detail container">
        <div class="outfit-detail-container py-2">
            <div class="outfit-detail-img col-lg-4 col-sm-7 col-xm-12">
                <v-carousel class="outfit-preview-img" v-model="carouselIndex" hide-delimiters>
                    <v-carousel-item v-for="(item, index) in outfit.hinhAnhs" :key="item" :value="index" :src="item">
                    </v-carousel-item>
                    <template v-slot:prev="{ props }">
                        <div @click="props.onClick" class="slide-btn prev-img">
                            <i class="fa fa-chevron-left" aria-hidden="true"></i>
                        </div>
                    </template>
                    <template v-slot:next="{ props }">
                        <div @click="props.onClick" class="slide-btn next-img">
                            <i class="fa fa-chevron-right" aria-hidden="true"></i>
                        </div>
                    </template>
                </v-carousel>
                <div class="outfit-carousel-img">
                    <div v-for="(item, index) in outfit.hinhAnhs" :key="item" class="outfit-carousel-item">
                        <img @click="carouselIndex = index" :src="item" alt="preview 1" />
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
                            <span class="status-notice ps-1">
                                <b>{{ outfitStatus == 1 ? 'Đang cho thuê' : (outfitStatus == -1 ? 'Tạm hết' : 'Ngừng cho thuê')
                                    }}</b>
                            </span>
                        </div>
                    </div>
                    <div class="outfit-price col-sm-6 d-flex align-items-baseline">
                        <span>Giá:</span><span>{{ price }}</span>
                    </div>
                    <!--size-->
                    <div v-if="showSize" class="outfit-size col-sm-12 d-flex align-items-baseline">
                        <span>Kích thước:</span>
                        <div class="outfit-size-box">
                            <div v-for="size in outfitDisplay.display.kichThuocs" :key="size.id" class="size-item"
                                :class="{ 'not-allow-click': size.soLuong < 1 }">
                                <input hidden type="radio" :id="'size-' + size.maKichThuoc" name="check_size"
                                    :value="size.maKichThuoc" />
                                <label  :for="'size-' + size.maKichThuoc"
                                    :class="{ 'sd': checkOutFit.checkSize == size.maKichThuoc }"
                                    @click="chooseOutfitSize(size.maKichThuoc)">
                                    {{ size.maKichThuoc }}
                                    <i class="fa fa-check" aria-hidden="true"></i>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div v-if="hasOutfitPieces" class="outfit-accessory col-sm-12 d-flex align-items-baseline">
                        <span>Phân loại:</span>
                        <div class="select-accessory">
                            <div v-for="item in outfit.manhTrangPhucs" :key="item.id" 
                                @click="chooseOutfitHandle(item.id)" class="accessory-item"
                                :class="{ active: item.id == outfitDisplay.display.id,
                                'cross-not-sale':cannotChoose(item)}">
                                {{ item.tenTrangPhuc }}
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
                    <div class="outfit-add-cart col-sm-12 d-flex align-items-baseline">
                        <button @click.prevent="addCart" class="btn">THÊM VÀO GIỎ</button>
                        <!-- <button class="btn">THUÊ NGAY</button> -->
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
    /* width: 90%; */
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

.not-allow-click {
    cursor: not-allowed;
}
div.cross-not-sale {
    position: relative;
    overflow: hidden;
}
.cross-not-sale::after {
    content: "";
    font-size: 20px;
    width: 100%;
    height: 1px;
    position: absolute;
    background-color: #ccc;
    top:50%;
    left:0;
    z-index:1000;
    transform:rotate(15deg)
}
.cross-not-sale::before {
    content: "";
    font-size: 20px;
    width: 100%;
    height: 1px;
    position: absolute;
    background-color: #ccc;
    top:50%;
    right:0;
    z-index:1000;
    transform:rotate(-15deg)
}
</style>
