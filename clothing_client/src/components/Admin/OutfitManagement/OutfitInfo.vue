<template>
    <div class="add-outfit-container container mt-5">
        <div class="add-outfit-wrap col-sm-10">
            <div class="add-outfit-header">
                <div class="header">
                    <svg @click="$router.back()" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 30 24"
                        fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 12H6M12 5l-7 7 7 7" />
                    </svg>
                    <span class="d-flex align-items-center"><span>Thông tin sản phẩm</span>
                        <Link v-if="updateOutfit" :to="{name:'update-outfit', params:{id:props.id}}">
                            <v-btn class="ma-2" color="indigo" size="x-small" icon="mdi-wrench">
                            <v-icon aria-hidden="false">mdi-wrench</v-icon>
                            <v-tooltip activator="parent" location="bottom">Chỉnh thông tin sản phẩm</v-tooltip>
                        </v-btn>
                        </Link>
                    </span>
                </div>
            </div>
            <div class="add-outfit-form mt-3">
                <div class="add-outfit-info col-sm-5">
                    <div class="input-data outfit-name">
                        <label for="outfitName">Mã trang phục</label>
                        <div>{{ outfit.id }}</div>
                    </div>
                    <div class="input-data outfit-name">
                        <label for="outfitName">Tên trang phục</label>
                        <div>{{ outfit.tenTrangPhuc }}</div>
                    </div>
                    <div> <div class="input-data outfit-name">
                        <label for="outfitName">Phân loại</label>
                        <div v-if="outfit.manhTrangPhucs?.length == 0">Không</div>
                    </div>
                        <div v-if="outfit.manhTrangPhucs?.length > 0" class="accessary-container w-100">
                            <v-sheet class="mx-auto accessary-content" color="#435c70" max-width="300">
                                <div class="pa-4">
                                    <v-chip-group column>
                                        <v-chip :disabled="!updateOutfit" density="comfortable" @click="showPiece(item)" size="large"
                                            v-for="(item, index) in outfit.manhTrangPhucs" :key="index">
                                            {{ item.tenTrangPhuc }}
                                        </v-chip>
                                    </v-chip-group>
                                </div>
                            </v-sheet>
                        </div>
                    </div>
                    <div class="input-data outfit-category">
                        <label for="category">Danh mục</label>
                        <div>{{ thisCategory?.tenLoai }} </div>
                    </div>
                    <div v-if="!outfit.manhTrangPhucs?.length" class="input-data outfit-price">
                        <label for="outfitPrice">Giá tiền</label>
                        <div>{{ convertToVND(outfit.giaTien) }}</div>
                    </div>
                    <div class="outfit-size" v-if="!outfit.manhTrangPhucs?.length">
                        <!--NOTE: v-for size-->
                        <div class="size" v-if="!isAccessary">
                            <div class="w-100">Kích thước</div>
                            <v-chip-group>
                                <v-chip :class="{'text-secondary':!size.trangThai}" @click="showSize(size)" v-for="size in ASCOutfitSize" :key="size.maKichThuoc">{{
                                    size.maKichThuoc }}
                                    <v-tooltip activator="parent" location="bottom">Ấn để xem</v-tooltip>
                                    </v-chip>
                            </v-chip-group>
                        </div>
                        <div v-else class="quantity-not-size mt-4">
                            <label for="quantity-not-size">Số lượng</label>
                            <input v-model="outfit.kichThuocs[0].tonKho" @blur="updateSize('NONE')" id="quantity-not-size"
                                type="number" placeholder="số lượng..." />
                        </div>
                    </div>
                </div>
                <!--image component-->
                <div class="add-outfit-image col-sm-5">
                    <div class="upload-images-container">
                        <label for="uploadImages">
                            <div v-if="images.length > 0" id="review-img">
                                <swiper :direction="'vertical'" :slides-per-view="1" :space-between="10"
                                    :mousewheel="true" class="mySwiper">
                                    <swiper-slide v-for="(image, index) in images" :key="index">
                                        <img :src="image.img" alt="Selected image" width="100%" />
                                    </swiper-slide>
                                    <div class="swiper-pagination" slot="pagination"></div>
                                </swiper>
                            </div>
                        </label>
                    </div>
                </div>
                <!--/image component-->
            </div>
            <div class="input-data outfit-description">
                        <label for="outfitDescription">Mô tả</label>
                        <div class="desc-text">{{ outfit.moTa }}</div>
                    </div>
        </div>
        <v-dialog v-model="pieceInfoDialog.show" min-width="500" width="auto">
            <v-card max-width="500" title="Thông tin mảnh trang phục">
                <template v-slot:text>
                    <div class="input-data outfit-size-id">
                        <label for="category">Mã trang phục</label>
                        <div>{{ pieceInfoDialog.piece.id }} </div>
                    </div>
                    <div class="input-data outfit-size-id">
                        <label for="category">Tên trang phục</label>
                        <div>{{ pieceInfoDialog.piece.tenTrangPhuc }} </div>
                    </div>
                    <div class="input-data outfit-size-quantity">
                        <label for="category">Giá tiền</label>
                        <div>{{ convertToVND(pieceInfoDialog.piece.giaTien) }} </div>
                    </div>
                    <div class="size">
                            <div class="w-100">Kích thước</div>
                            <v-chip-group>
                                <v-chip :disabled="!updateOutfit" :class="{'text-secondary':!size.trangThai}" @click="showSize(size,pieceInfoDialog.piece.id)" v-for="size in ASCPieceSize" :key="size.maKichThuoc">{{
                                    size.maKichThuoc }}
                                    <v-tooltip activator="parent" location="bottom">Ấn để xem</v-tooltip>
                                    </v-chip>
                            </v-chip-group>
                        </div>
                    <div class="input-data outfit-size-state">
                        <label for="category">Trạng thái</label>
                        <div>{{ pieceInfoDialog.piece.tinhTrang ? 'Đang cho thuê' : 'Ngừng cho thuê' }} </div>
                    </div>
                </template>
                <template v-slot:actions>
                    <div class="d-flex justify-content-between align-items-center">
                        <v-btn v-if="pieceInfoDialog.piece.tinhTrang" class="ms-auto me-2"  color="red" @click="lockOutfitPiece">
                        Ngừng thuê
                        <v-icon icon="mdi-cancel" end></v-icon>
                    </v-btn>
                    <v-btn v-else class="ms-auto" color="primary" @click="unlockOutfitPiece">
                        Mở khóa
                        <v-icon icon="mdi-checkbox-marked-circle" end></v-icon>
                    </v-btn>
                    <v-btn class="ms-auto" text="Thoát" @click="pieceInfoDialog.show = false"></v-btn>
                    </div>
                </template>
            </v-card>
        </v-dialog>
        <v-dialog v-model="sizeInfoDialog.show" min-width="500" width="auto">
            <v-card max-width="500" title="Kích thước trang phục">
                <template v-slot:text>
                    <div class="input-data outfit-size-id">
                        <label for="category">Mã kích thước</label>
                        <div>{{ sizeInfoDialog.size.maKichThuoc }} </div>
                    </div>
                    <div class="input-data outfit-size-quantity">
                        <label for="category">Số lượng</label>
                        <div>{{ sizeInfoDialog.size.soLuong }} </div>
                    </div>
                    <div class="input-data outfit-size-stock">
                        <label for="category">Tồn kho</label>
                        <div>{{ sizeInfoDialog.size.tonKho }} </div>
                    </div>
                    <div class="input-data outfit-size-state">
                        <label for="category">Trạng thái</label>
                        <div>{{ sizeInfoDialog.size.trangThai ? 'Đang cho thuê' : 'Ngừng cho thuê' }} </div>
                    </div>
                </template>
                <template v-slot:actions>
                    <div class="d-flex justify-content-between align-items-center">
                        <v-btn v-if="sizeInfoDialog.size.trangThai" class="ms-auto me-2"  color="red" @click="lockSize">
                        Ngừng thuê
                        <v-icon icon="mdi-cancel" end></v-icon>
                    </v-btn>
                    <v-btn v-else class="ms-auto" color="primary" @click.prevent="unlockSize">
                        Mở khóa
                        <v-icon icon="mdi-checkbox-marked-circle" end></v-icon>
                    </v-btn>
                    <v-btn class="ms-auto" text="Thoát" @click="sizeInfoDialog.show = false"></v-btn>
                    </div>
                </template>
            </v-card>
        </v-dialog>
        <Loading v-if="requestPending.pending" />
        <Result v-if="requestPending.error || requestPending.success" :success="requestPending.success"
            :error="requestPending.error">
            <span>{{ requestPending.message }}</span>
        </Result>
        <transition name="slide-fade">
            <Notification v-if="showMsg">
                <template v-slot:title>
                    <span>Thành công</span>
                </template>
                <template v-slot:message>
                    <span>{{ requestPending.message }}</span>
                </template>
            </Notification>
        </transition>
    </div>
</template>
<script setup>
import Link from '@/components/Link.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import { useRouter } from "vue-router";
import { ROLES } from "@/utils/constant";
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import { getCategory, getUpdateOutfit } from "@/data.function/getData";
import { lockOutfitSize , unlockOutfitSize,lockOutfit,unlockOutfit } from '@/data.function/postData';
import Notification from '@/components/Notification.vue'
import Loading from '@/components/Loading.vue';
import Result from '@/components/Admin/Result.vue';
import convertToVND from '@/utils/convertVND';
import { findCategoryById, sortSizes } from '@/utils/util.function';
import { Toast } from '@/utils/notification';
const router = useRouter();
const images = ref([]);
const sizeInfoDialog = reactive({
    show: false,
    size: {},
    outfitId: null
});
const pieceInfoDialog = reactive({
    show: false,
    piece: {},
});
const props = defineProps({
    id: {
        type: String,
        required: true
    }
})
const requestPending = reactive({
    pending: false,
    error: null,
    success: false,
    message: null
})
const outfit = ref({})
const thisCategory = ref({});
const isAccessary = computed(() => {
    return !!thisCategory.value.forAccessary;
})
const ASCOutfitSize = computed(() => sortSizes(outfit.value.kichThuocs))
const ASCPieceSize = computed(()=> sortSizes(pieceInfoDialog.piece.kichThuocs))
//UPDATED: đã fix lỗi lấy outfit sau khgi get category dẫn đến lỗi không tìm thấy được category
onBeforeMount(async () => {
    const categories = await getCategory();
    const updateOutfit = await getUpdateOutfit(props.id);
    outfit.value = Object.assign({}, updateOutfit)
    images.value = updateOutfit.hinhAnhs.map(item => {
        return {
            name: null,
            img: item,
            file: null,
        }
    })
    categories.forEach(item => {
        let temp = findCategoryById(item, outfit.value.theLoai);
        if (temp) {
            thisCategory.value = temp;
        }
    })
});
const updateOutfit = computed(() => {
  if (user.value.scope.includes(ROLES.ADMIN)) {
    let accept_role = [
      ROLES.SUPER_ACCOUNT,
      ROLES.FULL_CONTROL,
      ROLES.OUTFIT_UPDATE,
    ];
    if (
      user.value.scope.some((role) => {
        return accept_role.includes(role);
      })
    ) {
      return true;
    } else {
      return false;
    }
  }
  return false;
});
watch(requestPending, value => {
    if (value.error)
        setTimeout(() => {
            value.error = null;
            value.message = null;
        }, 1500);
    if (value.success) {
        setTimeout(() => {
            value.message = null;
            value.success = false;
        }, 1500);
    }
}, {
    deep: true,
})
const showSize = (size, outfitId=null) => {
    sizeInfoDialog.show = true;
    sizeInfoDialog.size = size;
    sizeInfoDialog.outfitId = outfitId == null ? outfit.value.id : outfitId;

}
const showPiece = (piece) =>{
    pieceInfoDialog.show = true;
    pieceInfoDialog.piece = piece;
}
const lockSize = () => {
    lockOutfitSize(sizeInfoDialog.size.maKichThuoc, sizeInfoDialog.outfitId).then(res =>{
        if(res){
            sizeInfoDialog.size.trangThai = false;
           outfit.value.kichThuocs.forEach(size => {
            if(size.maKichThuoc == sizeInfoDialog.size.maKichThuoc) {
                size.trangThai = false;
            }
           })
           Toast.fire({
            icon:'success',
            title: 'Đã ngừng thuê kích thước'
           })
        }
        else {
            Toast.fire({
            icon:'error',
            title: 'Có lỗi đã xảy ra'
           })
        }
    })
}
const unlockSize = () => {
    console.log("log here...");
    unlockOutfitSize(sizeInfoDialog.size.maKichThuoc, sizeInfoDialog.outfitId).then(res =>{
        if(res){
            sizeInfoDialog.size.trangThai = true;
           outfit.value.kichThuocs.forEach(size => {
            if(size.maKichThuoc == sizeInfoDialog.size.maKichThuoc) {
                size.trangThai = true;
            }
           })
           Toast.fire({
            icon:'success',
            title: 'Kích thước đã có thể thuê'
           })
        } else {
            Toast.fire({
            icon:'error',
            title: 'Có lỗi đã xảy ra'
           })
        }
    })
}
const lockOutfitPiece = () =>{
    let ids = []
    ids.push(pieceInfoDialog.piece.id)
    lockOutfit(ids).then(res =>{
        if(res){
           pieceInfoDialog.piece.trangThai = false;
           outfit.value.manhTrangPhucs.forEach(piece => {
            if(piece.id == pieceInfoDialog.piece.id) {
                piece.tinhTrang = false;
            }
           })
           Toast.fire({
            icon:'success',
            title: 'Đã ngừng thuê vật phẩm'
           })
        } else {
            Toast.fire({
            icon:'error',
            title: 'Có lỗi đã xảy ra'
           })
        }
    })
}
const unlockOutfitPiece = () =>{
    unlockOutfit(pieceInfoDialog.piece.id).then(res =>{
        if(res){
           pieceInfoDialog.piece.trangThai = true;
           outfit.value.manhTrangPhucs.forEach(piece => {
            if(piece.id == pieceInfoDialog.piece.id) {
                piece.tinhTrang = true;
            }
           })
           Toast.fire({
            icon:'success',
            title: 'Trang phục đã có thể cho thuê'
           })
        } else {
            Toast.fire({
            icon:'error',
            title: 'Có lỗi đã xảy ra'
           })
        }
    })
}
</script>
<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: opacity 0.5s, transform 0.5s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
}

.mySwiper {
    width: 100%;
    height: 300px;
}

.swiper-slide img {
    display: block;
    width: 100%;
    height: auto;
}

.add-outfit-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.add-outfit-wrap {
    background-color: #435c70;
    padding: 20px;
    color: white;
}

.add-outfit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.add-outfit-header .header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.add-outfit-wrap .add-outfit-header {
    font-size: 20px;
    font-weight: bold;
}

.add-submit {
    width: 200px;
    padding: 5px;
    border: 1px solid #ccc;
}

.add-outfit-wrap .add-outfit-header svg {
    width: 50px;
    padding: 5px 10px;
    margin-right: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.add-outfit-wrap .add-outfit-header svg:hover {
    transform: scale(1.1);
}

.add-outfit-wrap .add-outfit-header svg:active {
    transform: translateX(-10px);
}

.add-outfit-form {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
}

.add-outfit-image .upload-images-container {
    width: 200px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    border: 1px solid #ccc;
    position: relative;
}

.upload-images-container label {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

#review-img {
    width: 100%;
    height: 100%;
    padding: 3px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
}

#review-img img {
    display: block;
    width: 100%;
    height: 300px;
    object-fit: cover;
}

.img-counter,
.img-reset {
    position: absolute;
    top: -10px;
    right: -5px;
    color: orange;
    background-color: #435c70;
    border: 1px solid #ccc;
    width: 30px;
    height: 30px;
    padding: 5px;
    border-radius: 50%;
    font-weight: bold;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.img-reset {
    top: -10px;
    left: -5px;
    cursor: pointer;
}

.input-data {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-bottom: 20px;
}
.input-data.outfit-description {
    justify-content: flex-start;
    flex-direction: column;
    text-align: justify;
}

.input-data label {
    color: orange;
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: bold;
    display: inline-block;
    min-width: 100px;
}

.input-data input {
    margin-bottom: 5px;
    padding-left: 20px;
    font-size: 16px;
    background-color: #54657d;
    padding: 10px;
    border: none;
    outline: none;
    box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.2);
}

.input-data input[type="number"] {
    width: 40%;
}

.input-data .outfit-price {
    flex-direction: row;
}

.input-data textarea {
    width: 100%;
    height: 100px;
    margin-bottom: 5px;
    padding-left: 20px;
    font-size: 16px;
    background-color: #54657d;
    padding: 10px;
    border: none;
    outline: none;
    box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.2);
}

.input-data textarea:focus {
    border: 1px solid #435c70;
    background-color: #435c86;
    color: white;
}

.input-data input:focus {
    border: 1px solid #435c70;
    background-color: #435c86;
    color: white;
}

.input-data button {
    width: 100%;
    margin-bottom: 5px;
    padding-left: 20px;
    font-size: 16px;
    background-color: #54657d;
    padding: 10px;
    color: white;
    border: none;
    outline: none;
    box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.2);
}

.outfit-size .size,
.outfit-piece-size .size {
    width: 100%;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
}

.size-label {
    width: 50%;
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 5px 0;
}

.size-label input {
    width: 60%;
    background-color: #435c70;
    padding: 5px;
    border: none;
    outline: none;
    box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.2);
}

.outfit-piece-size .size-label input {
    background-color: #eee;
    color: black;
}

input.quantity {
    width: 0;
    transition: all 0.3s ease;
    visibility: hidden;
    opacity: 0;
    color: #fff;
}

input.quantity::placeholder {
    color: #ccc;
}

.size-label>input:first-child:checked~input {
    opacity: 1;
    visibility: visible;
    width: 60%;
}

.quantity-not-size {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

.quantity-not-size input {
    width: 60%;
    background-color: #435c70;
    padding: 5px;
    border: none;
    outline: none;
    color: #fff;
    box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.2);
}

.quantity-not-size input:focus {
    border: 2px solid #435c70;
    background-color: #435c86;
}

.input-size[type="checkbox"] {
    display: none;
}

/* Style for the custom checkbox */
.size-checkbox {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid #333;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
}

/* Style for the custom checkmark */
.size-checkbox::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    background-color: #fff;
    border-radius: 2px;
    opacity: 0;
}

.outfit-piece-size .size-checkbox::after {
    background-color: #004D40;
}

/* Show the checkmark when checkbox is checked */
.input-size[type="checkbox"]:checked+.size-checkbox::after {
    opacity: 1;
}

ul.menu {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    flex-direction: column;
}

ul.menu>li> {
    display: inline-block;
    margin: 0 12px;
    font-weight: 500;
}

.menu {
    margin: 0;
}

.menu li {
    cursor: pointer;
}

#category {
    color: #fff;
    padding: 10px;
    font-weight: bold;
}

/* .accessary-content {
      background-color: #435c70 !important;
    } */
</style>