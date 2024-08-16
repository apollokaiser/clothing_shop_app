<template>
  <div class="add-outfit-container container mt-5">
    <div class="add-outfit-wrap col-sm-10">
      <div class="add-outfit-header">
        <div class="header">
          <svg @click="back" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 30 24" fill="none"
            stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H6M12 5l-7 7 7 7" />
          </svg>
          <span>Thêm sản phẩm</span>
        </div>
        <div class="add-action">
          <button class="add-submit" @click.prevent="addOufitHandle">Thêm ngay</button>
        </div>
      </div>
      <div class="add-outfit-form mt-3">
        <div class="add-outfit-info col-sm-5">
          <div class="input-data outfit-name">
            <label for="outfitName">Tên sản phẩm</label>
            <input v-model="data.tenTrangPhuc" type="text" id="outfitName" />
          </div>
          <div>
            <v-dialog max-width="500" v-if="!isAccessary">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn v-bind="activatorProps" prepend-icon="mdi-plus" class="mt-5 w-50">
                  <template v-slot:prepend>
                    <v-icon color="success"></v-icon>
                  </template>
                  Thêm phân loại
                </v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card title="Phân loại mới">
                  <v-card-text>
                    <v-text-field v-model="outfitPiece.tenTrangPhuc" :rules="[validateRoles.require]"
                      label="Tên trang phục" variant="outlined" class="my-3"></v-text-field>
                    <v-text-field v-model="outfitPiece.giaTien" :rules="[validateRoles.numberRequired]" label="Giá thuê"
                      variant="outlined"></v-text-field>
                    <div class="outfit-piece-size">
                      <div>Kích thước</div>
                      <div class="size">
                        <label class="size-label" v-for="item in size" :key="item">
                          <input v-model="outfitPieceSize[item].checked" type="checkbox" class="input-size"
                            :value="item" />
                          <span class="size-checkbox"></span>
                          <span>{{ item }}</span>
                          <input v-model="outfitPieceSize[item].quantity" class="quantity" type="number"
                            placeholder="số lượng ..." />
                        </label>
                      </div>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Thoát" @click="isActive.value = false"></v-btn>
                    <v-btn :disabled="addPieceCommand" text="Lưu" @click.prevent="addPiece"></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
            <div v-if="!isAccessary && data.manhTrangPhucs.length > 0" class="accessary-container w-100 mt-5">
              <v-sheet class="mx-auto accessary-content" color="#435c70" max-width="300">
                <div class="pa-4">
                  <v-chip-group column>
                    <v-chip density="comfortable" @click="updatePiece(index)" size="large" closable
                      v-model="data.manhTrangPhucs[index]" @click:close="removePiece"
                      v-for="(item, index) in data.manhTrangPhucs" :key="index"> {{
                        item.tenTrangPhuc }} </v-chip>
                  </v-chip-group>
                </div>
              </v-sheet>
            </div>
          </div>
          <div class="input-data outfit-description">
            <label for="outfitDescription">Mô tả</label>
            <textarea v-model="data.moTa" id="outfitDescription" />
          </div>
          <div class="input-data outfit-category">
            <label for="category">Danh mục</label>
            <button data-bs-toggle="modal" data-bs-target="#chooseCategory">
              Chọn danh mục
            </button>
            <div v-if="choosedCategory.length > 0" id="category">
              {{ choosedCategory.at(0).tenLoai }}
            </div>
          </div>
          <div v-if="!data.manhTrangPhucs.length" class="input-data outfit-price">
            <label for="outfitPrice">Giá tiền</label>
            <input v-model="data.giaTien" type="number" id="outfitPrice" />
          </div>
          <div class="outfit-size" v-if="!data.manhTrangPhucs.length">
            <!--NOTE: v-for size-->
            <div class="size" v-if="!isAccessary">
              <div class="w-100">Kích thước</div>
              <label class="size-label" v-for="item in size" :key="item">
                <input v-model="selectedSize[item].checked" type="checkbox" class="input-size" :value="item" />
                <span class="size-checkbox"></span>
                <span>{{ item }}</span>
                <input v-model="selectedSize[item].quantity" class="quantity" type="number"
                  placeholder="số lượng ..." />
              </label>
            </div>
            <div v-else class="quantity-not-size mt-4">
              <label for="quantity-not-size">Số lượng</label>
              <input v-model="data.tonKho" id="quantity-not-size" type="number" placeholder="số lượng..." />
            </div>
          </div>
        </div>
        <!--image component-->
        <div class="add-outfit-image col-sm-5">
          <div class="upload-images-container">
            <label for="uploadImages">
              <div v-if="images.length > 0" id="review-img">
                <swiper :direction="'vertical'" :slides-per-view="1" :space-between="10" :mousewheel="true"
                  class="mySwiper">
                  <swiper-slide v-for="(image, index) in images" :key="index">
                    <img :src="image.img" alt="Selected image" width="100%" />
                  </swiper-slide>
                  <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
              </div>
            </label>
            <input type="file" id="uploadImages" hidden accept="image/**" multiple @change="uploadImages" />
            <div v-if="images.length > 0" class="img-counter">
              <span>{{ images.length }}</span>
            </div>
            <div v-if="images.length > 0" class="img-reset">
              <span @click="resetImage">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 30" fill="none"
                  stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38" />
                </svg>
              </span>
            </div>
          </div>
        </div>
        <!--/image component-->
      </div>
    </div>
    <div class="modal fade" id="chooseCategory" tabindex="-1" aria-labelledby="chooseCategoryLabel" aria-hidden="true"
      data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="chooseCategoryLabel">Thêm danh mục</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ul class="menu">
              <ListCategory v-for="c in category" :item="c" :key="c.maLoai" :single="true">
              </ListCategory>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="removeCategory" data-bs-dismiss="modal">
              Thoát
            </button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
              Chọn
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--update dialog fixed-->
    <v-dialog v-model="dialog" width="auto">
      <v-card max-width="400" prepend-icon="mdi-update" title="Cập nhật trang phục">
        <v-card-text>
          <v-text-field v-model="outfitPiece.tenTrangPhuc" :rules="[validateRoles.require]" label="Tên trang phục"
            variant="outlined" class="my-3"></v-text-field>
          <v-text-field v-model="outfitPiece.giaTien" :rules="[validateRoles.numberRequired]" label="Giá thuê"
            variant="outlined"></v-text-field>
          <div class="outfit-piece-size">
            <div>Kích thước</div>
            <div class="size">
              <label class="size-label" v-for="item in size" :key="item">
                <input v-model="outfitPieceSize[item].checked" type="checkbox" class="input-size" :value="item" />
                <span class="size-checkbox"></span>
                <span>{{ item }}</span>
                <input v-model="outfitPieceSize[item].quantity" class="quantity" type="number"
                  placeholder="số lượng ..." />
              </label>
            </div>
          </div>
        </v-card-text>
        <template v-slot:actions>
          <v-btn class="ms-auto" text="Thoát" @click="dialog = false"></v-btn>
          <v-btn class="ms-auto" text="Đồng ý" @click="addPiece(true)"></v-btn>

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
import { sentenceCase } from "sentence-case";
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import { useRouter } from "vue-router";
import ListCategory from "@/components/Admin/ListCategory.vue";
import { useResource } from "@/stores/resource.store";
import { useAdminStore } from "@/stores/admin.store";
import { storeToRefs } from "pinia";
import { onBeforeMount, reactive, watch, ref, computed } from "vue";
import { getCategory } from "@/data.function/getData";
import { addOutfit } from '@/data.function/postData';
import Notification from '@/components/Notification.vue'
import Loading from '@/components/Loading.vue';
import Result from '@/components/Admin/Result.vue';
import { StringBuilder } from '@/utils/StringBuilder';
import { Toast } from '@/utils/notification';
const router = useRouter();
const resource = useResource();
const { category } = storeToRefs(resource);
const admin = useAdminStore();
const { choosedCategory } = storeToRefs(admin);
const size = ref(["S", "M", "L", "XL", "XXL"]);
const images = ref([]);
const dialog = ref(false);
const updateIndex = ref(-1);
const selectedSize = reactive({
  S: { checked: true, quantity: 0 },
  M: { checked: true, quantity: 0 },
  L: { checked: true, quantity: 0 },
  XL: { checked: false, quantity: 0 },
  XXL: { checked: false, quantity: 0 },
});
const outfitPieceSize = reactive({
  S: { checked: true, quantity: 0 },
  M: { checked: true, quantity: 0 },
  L: { checked: true, quantity: 0 },
  XL: { checked: false, quantity: 0 },
  XXL: { checked: false, quantity: 0 },
});
const requestPending = reactive({
  pending: false,
  error: null,
  success: false,
  message: null,
})
const data = reactive({
  tenTrangPhuc: "",
  giaTien: 0,
  moTa: "",
  theLoai: 0,
  tonKho: 0,
  hasPiece: false,
  hinhAnhs: [],
  kichThuocs: [],
  manhTrangPhucs: [],
});
const outfitPiece = reactive({
  tenTrangPhuc: "",
  giaTien: 0,
  hasPiece: false,
  kichThuocs: [],
})
onBeforeMount(() => {
  getCategory().then((cat) => {
    category.value = cat;
  });
});
const isAccessary = computed(() => {
  return !!choosedCategory.value[0]?.forAccessary;
})

const notSize = computed(() => {
  return size.value.every(element => selectedSize[element].checked == false);
})
//UPDATED: fix lỗi khi chọn danh mục thì kích thước lại null
watch(
  choosedCategory,
  (value) => {
    if (value && value.length > 0) {
      data.theLoai = value[0].maLoai;
      if (isAccessary.value) {
        data.kichThuocs = []
        data.kichThuocs.push({ maKichThuoc: "NONE", tonKho: 0 });
        data.manhTrangPhucs = [];
        data.hasPiece = false;
      }
    }
  },
  {
    deep: true,
  }
);
watch(selectedSize, value => {
  if (size.value.every(element => value[element].checked == false)) {
    data.kichThuocs = [];
  }
}, {
  deep: true,
})
watch(() => data.manhTrangPhucs, value => {
  // Nếu có mảnh trang phục và là lần đầu watcher đầu tiên (hasPiece sẽ false)
  if (value.length > 0 && !data.hasPiece) {
    data.kichThuocs = [];
    data.kichThuocs.push({ maKichThuoc: "NONE", tonKho: 0 })
    data.hasPiece = true;
    data.giaTien = 0
    data.tonKho = 0;
  }
  else if (value.length == 0) {
    data.kichThuocs = []
    data.hasPiece = false;

  }
}, {
  deep: true,
})
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
const validateRoles = {
  require: value => !!value || "Không thể để trống",
  numberRequired: value => !isNaN(value) || "Vui lòng nhập giá tiền hợp lệ"
}
const resetData = () => {
  data.tenTrangPhuc = "";
  data.giaTien = 0;
  data.moTa = "";
  data.theLoai = 0;
  data.hinhAnhs = [];
  data.kichThuocs = [];
  data.manhTrangPhucs = [];
}
const updatePiece = (index) => {
  updateIndex.value = index;
  outfitPiece.tenTrangPhuc = data.manhTrangPhucs[index].tenTrangPhuc;
  outfitPiece.giaTien = data.manhTrangPhucs[index].giaTien;
  outfitPiece.kichThuocs = data.manhTrangPhucs[index].kichThuocs;
  //reset status sizes
  Object.keys(outfitPieceSize).forEach(key => outfitPieceSize[key].checked = false);
  // add size for update
  outfitPiece.kichThuocs.forEach(outfitSize => {
    outfitPieceSize[outfitSize.maKichThuoc].checked = true;
    outfitPieceSize[outfitSize.maKichThuoc].quantity = outfitSize.tonKho;
  })
  dialog.value = true;
}
const removeCategory = () => {
  admin.resetCategory();
}
const uploadImages = (event) => {
  let files = event.target.files;
  Array.from(files).forEach((element) => {
    images.value.push({
      name: element.name,
      img: URL.createObjectURL(element),
      file: element,
    });
  });
};
const resetImage = () => {
  images.value.forEach((element) => {
    URL.revokeObjectURL(element.img);
  });
  images.value = [];
};
const back = () => {
  router.back();
};
const removePiece = () => {
  data.manhTrangPhucs = data.manhTrangPhucs.filter(item => item != false);
}
const addPiece = (update = false) => {
  if (size.value.every(element => outfitPieceSize[element].checked == false)) {
   Toast.fire({
    icon: 'error',
    title: 'Thông báo',
    text: 'Nhập kích thước cho trang phục'
   })
    return;
  }
  let unvalidSize = size.value.some(element => outfitPieceSize[element].checked && (outfitPieceSize[element].quantity == 0 || !StringBuilder.isNumber(outfitPieceSize[element].quantity)))
  if (unvalidSize) {
    Toast.fire({
    icon: 'error',
    title: 'Thông báo',
    text: 'Bạn phải nhập số lượng cho kích thước đã chọn'
   })
  }
  if (StringBuilder.isEmpty(outfitPiece.tenTrangPhuc) || !StringBuilder.isNumber(outfitPiece.giaTien)) {
    return;
  }
  let kichThuocs = Object.keys(outfitPieceSize).map(key => {
    if (outfitPieceSize[key].checked == true)
      return { maKichThuoc: key, tonKho: outfitPieceSize[key].quantity };
  }).filter(item => item != undefined);
  outfitPiece.kichThuocs = kichThuocs;
  let temp = Object.assign({}, outfitPiece)
  if (updateIndex.value != -1 && update) {
    data.manhTrangPhucs[updateIndex.value] = temp;
  } else
    data.manhTrangPhucs.push(temp);
  updateIndex.value = -1;
  resetOutfitPiece();
}

const resetOutfitPiece = () => {
  outfitPiece.tenTrangPhuc = "";
  outfitPiece.giaTien = 0;
  outfitPiece.kichThuocs = [];
}
const addOufitHandle = () => {
  if (choosedCategory.value.length > 1 || choosedCategory.value.length == 0) {
    alert("Bạn phải chọn 1 danh mục");
    return;
  }
  if (images.value.length == 0) {
    alert("Bạn phải thêm ít nhất 1 ảnh");
    return;
  }
  //Kiểm tra forAccessory ở đây. Nếu không phải đạo cụ, không có các mảnh trang phục, bắt buộc phải có số lượng của kích thước
  if (notSize.value && !isAccessary.value && data.manhTrangPhucs.length == 0) {
    alert("Bạn phải chọn kích thước hoặc nhập số lượng");
    return;
  }
  // nếu là đạo cụ thì bắt buộc phải có số lượng
  if (isAccessary.value && data.tonKho <= 0) {
    alert("Bạn phải nhập số lượng cho đạo cụ");
    return;
  }
  // Nếu là trang phục cho thuê cả bộ (không phải đạo cụ và không chứa mảnh trang phục)
  if (data.manhTrangPhucs.length == 0 && !isAccessary.value) {
    let size = Object.keys(selectedSize).map(key => {
      if (selectedSize[key].checked == true)
        return { maKichThuoc: key, tonKho: selectedSize[key].quantity };
    }).filter(item => item != undefined);
    if (!notSize.value) {
      if (size.some(item => item.tonKho <= 0)) {
        console.log(size);
        alert("Bạn phải nhập số lượng cho tất cả kích thước");
        return;
      }
    }
    size.forEach(item => {
      data.kichThuocs.push(item);
    })
  }
  // Nếu là đạo cụ thì lấy số lượng gán cho trang phục
  if (isAccessary.value) {
    if(data.kichThuocs.length==0) {
      data.kichThuocs.push({ maKichThuoc: "NONE", tonKho: 0 })
    }
    data.kichThuocs[0].tonKho = data.tonKho ? data.tonKho : 0;
  }
  data.tenTrangPhuc = sentenceCase(data.tenTrangPhuc);
  requestPending.pending = true;
  addOutfit(data, images.value.map(item => item.file)).then(response => {
    requestPending.pending = false;
    if (response.status == 200) {
      admin.resetCategory();
      resetData();
      resetImage();
      requestPending.success = true;
      requestPending.message = "Thêm sản phẩm thành công";
    } else {
      requestPending.error = true;
      requestPending.message = "Thêm sản phẩm thất bại";
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

/* .add-outfit-image {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
} */

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

/* #review-img > .review-wrap-item {
  width: 100%;
  height: 300px;
  display: block;
  margin-bottom: 10px;
} */
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
  flex-direction: column;
}

.input-data label {
  color: #ccc;
  margin-bottom: 5px;
  font-size: 16px;
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
