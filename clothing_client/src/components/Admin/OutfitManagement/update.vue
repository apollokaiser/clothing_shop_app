<template>
  <div class="add-outfit-container container mt-5">
    <div class="add-outfit-wrap col-sm-10">
      <div class="add-outfit-header">
        <div class="header">
          <svg @click="back" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 30 24" fill="none"
            stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H6M12 5l-7 7 7 7" />
          </svg>
          <span class="d-flex align-items-center"><span>Thông tin sản phẩm</span>
            <v-btn class="ma-2" color="indigo" size="x-small" icon="mdi-wrench">
              <v-icon aria-hidden="false">mdi-wrench</v-icon>
              <v-tooltip activator="parent" location="bottom">Chỉnh thông tin sản phẩm</v-tooltip>
            </v-btn>
          </span>
        </div>
        <div class="add-action">
          <button class="add-submit" @click.prevent="addOufitHandle">Cập nhật</button>
        </div>
      </div>
      <div class="add-outfit-form mt-3">
        <div class="add-outfit-info col-sm-5">
          <div class="input-data outfit-name">
            <label for="outfitName">Tên sản phẩm</label>
            <input v-model="data.outfit.tenTrangPhuc" type="text" id="outfitName" />
          </div>
          <div>
            <v-dialog max-width="500" v-if="!isAccessary">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn @click="resetOutfitPiece" v-bind="activatorProps" prepend-icon="mdi-plus" class="mt-5 w-50">
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
                          <input v-model="outfitPieceSize[item].quantity" class="quantity" type="text"
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
            <div v-if="!isAccessary && data.outfit.manhTrangPhucs?.length > 0" class="accessary-container w-100 mt-5">
              <v-sheet class="mx-auto accessary-content" color="#435c70" max-width="300">
                <div class="pa-4">
                  <v-chip-group column>
                    <v-chip density="comfortable" @click="updatePiece(index)" size="large"
                      v-model="data.outfit.manhTrangPhucs[index]" v-for="(item, index) in data.outfit.manhTrangPhucs"
                      :key="index">
                      {{
                        item.tenTrangPhuc }}
                      <template #close>
                        <v-icon icon="mdi-close-circle" @click.stop="removePiece(data.outfit.manhTrangPhucs[index])" />
                      </template>
                    </v-chip>
                  </v-chip-group>
                </div>
              </v-sheet>
            </div>
          </div>
          <div class="input-data outfit-description">
            <label for="outfitDescription">Mô tả</label>
            <textarea v-model="data.outfit.moTa" id="outfitDescription" />
          </div>
          <div class="input-data outfit-category">
            <label for="category">Danh mục</label>
            <button data-bs-toggle="modal" data-bs-target="#chooseCategory">
              {{ data.category?.tenLoai || 'Chọn danh mục' }}
            </button>
            <!-- <div v-if="choosedCategory?.length > 0" id="category">
              {{ choosedCategory?.at(0).tenLoai }}
            </div> -->
          </div>
          <div v-if="!data.outfit.manhTrangPhucs?.length" class="input-data outfit-price">
            <label for="outfitPrice">Giá tiền</label>
            <input v-model="data.outfit.giaTien" type="number" id="outfitPrice" />
          </div>
          <div class="outfit-size" v-if="!data.outfit.manhTrangPhucs?.length">
            <!--NOTE: v-for size-->
            <div class="size" v-if="!isAccessary">
              <div class="w-100">Kích thước</div>
              <label class="size-label" v-for="item in size" :key="item">
                <input v-model="selectedSize[item].checked" type="checkbox" class="input-size" :value="item" />
                <span class="size-checkbox"></span>
                <span>{{ item }}</span>
                <input v-model="selectedSize[item].quantity" @blur="updateSize(item)" class="quantity" type="number"
                  placeholder="số lượng ..." />
              </label>
            </div>
            <div v-else class="quantity-not-size mt-4">
              <label for="quantity-not-size">Số lượng</label>
              <input v-model="data.outfit.tonKho" @blur="updateSize('NONE')" id="quantity-not-size" type="number"
                placeholder="số lượng..." />
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
                    <img @mouseover="checkImage(index)" :src="image.img" alt="Selected image" width="100%" />
                  </swiper-slide>
                  <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
              </div>
            </label>
            <input type="file" id="uploadImages" hidden accept="image/**" multiple @change="uploadImages" />
            <div @click="removeImage" v-if="images.length > 0" class="img-counter">
              <span>X</span>
            </div>
            <div class="img-reset">
              <span @click="resetImage">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 30" fill="none"
                  stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38" />
                </svg>
              </span>
            </div>
          </div>
          <div class="remove-all-btn">
            <button @click.prevent="deleteAll" type="">Chọn lại</button>
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
              <ListCategory v-for="c in category" :item="c" :key="c.maLoai" :single="true"
                :accessary="data.outfit.manhTrangPhucs?.length == 0" :initial="choosedCategory">
              </ListCategory>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="removeCategory" data-bs-dismiss="modal">
              Thoát
            </button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="addCategory">
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
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import { useRouter } from "vue-router";
import ListCategory from "@/components/Admin/ListCategory.vue";
import { useResource } from "@/stores/resource.store";
import { useAdminStore } from "@/stores/admin.store";
import { storeToRefs } from "pinia";
import { onBeforeMount, reactive, watch, ref, computed, toRaw } from "vue";
import { getCategory, getUpdateOutfit } from "@/data.function/getData";
import { addOutfit, updateOutfit } from '@/data.function/postData';
import Notification from '@/components/Notification.vue'
import Loading from '@/components/Loading.vue';
import Result from '@/components/Admin/Result.vue';
import { StringBuilder } from '@/utils/StringBuilder';
import { Toast } from '@/utils/notification';
import UpdateOutfit from './UpdateOutfit.vue';
import { sortSizes } from '@/utils/util.function';
import { isInclude } from '@/utils/ArrayMethod';
const router = useRouter();
const resource = useResource();
const { category } = storeToRefs(resource);
const admin = useAdminStore();
const { choosedCategory } = storeToRefs(admin);
const size = ref(["S", "M", "L", "XL", "XXL"]);
const init = ref(false);
const images = ref([]);
const dialog = ref(false);
const updateIndex = ref(-1);
const deleteOutfitSize = ref([])
const deleteSizes= ref([]);
const selectedSize = reactive({
  S: { checked: false, quantity: 0 },
  M: { checked: false, quantity: 0 },
  L: { checked: false, quantity: 0 },
  XL: { checked: false, quantity: 0 },
  XXL: { checked: false, quantity: 0 },
});
const outfitPieceSize = reactive({
  S: { checked: false, quantity: 0 },
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
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})
const data = reactive({
  outfit: [],
  originOutfit: [],
  category: {}
});
const outfitPiece = reactive({
  id: "",
  tenTrangPhuc: "",
  giaTien: 0,
  hasPiece: false,
  kichThuocs: [],
  deleteKichThuoc: []
})
const outfitStatic = ref({});
//UPDATED: đã fix lỗi lấy outfit sau khgi get category dẫn đến lỗi không tìm thấy được category
onBeforeMount(async () => {
  const categories = await getCategory()
  const updateOutfit = await getUpdateOutfit(props.id);
  updateOutfit.tonKho = 0
  data.outfit = Object.assign({}, updateOutfit)
  data.originOutfit = JSON.parse(JSON.stringify(updateOutfit));
  outfitStatic.value = JSON.parse(JSON.stringify(updateOutfit));
  if (updateOutfit.kichThuocs[0]?.maKichThuoc != "NONE") {
    updateOutfit.kichThuocs.forEach((item) => {
      let size = item.maKichThuoc;
      selectedSize[size].checked = true;
      selectedSize[size].quantity = item.tonKho;
    });
  }
  if (updateOutfit.kichThuocs[0].maKichThuoc == "NONE" && !updateOutfit.hasPiece) {
    data.outfit.tonKho = Number(updateOutfit.kichThuocs[0].tonKho);
    data.originOutfit.tonKho = Number(updateOutfit.kichThuocs[0].tonKho);
  }
  categories.forEach(item => {
    if (choosedCategory.value.length == 0) {
      let thisCategory = findCategoryById(item, data.outfit.theLoai);
      if (thisCategory) {
        choosedCategory.value.push(thisCategory);
        data.category = thisCategory;
      }
    }
  })
  resource.setCategory(categories);

  images.value = updateOutfit.hinhAnhs.map(item => {
    return {
      name: null,
      img: item,
      file: null,
    }
  })
  init.value = true;
});
function findCategoryById(root, maLoai) {
  if (root.maLoai == maLoai) {
    return root;
  }
  if (root.children) {
    for (const child of root.children) {
      const result = findCategoryById(child, maLoai);
      if (result) {
        return result;
      }
    }
  }
  return null;
}
const isAccessary = computed(() => {
  return !!data.category.forAccessary;
})
const notSize = computed(() => {
  return size.value.every(element => selectedSize[element].checked == false);
})
//UPDATED: fix lỗi khi chọn danh mục thì kích thước lại null
watch(() => data.category,
  (value) => {
    if (value) {
      data.outfit.theLoai = value.maLoai;
      // không cho chạy lần đầu (lần gán dữ liệu)
      if (isAccessary.value && !init.value && value.maLoai != data.originOutfit.theLoai) {
        data.outfit.kichThuocs = []
        data.outfit.kichThuocs.push({ maKichThuoc: "NONE", tonKho: 0 });
        data.outfit.manhTrangPhucs = [];
        data.outfit.hasPiece = false;
        init.value = false;
      } 
      //Nếu chọn lại cái cũ 
      if (value.maLoai == data.originOutfit.theLoai) {
        data.outfit.kichThuocs = JSON.parse(JSON.stringify(data.originOutfit.kichThuocs));
        data.outfit.tonKho =  Number(data.outfit.kichThuocs[0].tonKho)
      }
    }
  },
  {
    deep: true,
  }
);
const updateSize = (size) => {
  let thisOutfitSize = Object.assign({}, data.originOutfit.kichThuocs.find(item => item.maKichThuoc == size))
  if (thisOutfitSize.tonKho != thisOutfitSize.soLuong) {
    if (size == "NONE" && data.outfit.tonKho < thisOutfitSize.tonKho) {
      Toast.fire({
        icon: 'error',
        title: `Không thể thiết lập số lượng nhỏ hơn ${thisOutfitSize.tonKho} khi tất cả trang phục chưa thu hồi`
      })
      data.outfit.tonKho = thisOutfitSize.tonKho;
    } else if (size != "NONE" && selectedSize[size].quantity < thisOutfitSize.tonKho) {
      Toast.fire({
        icon: 'error',
        title: `Không thể thiết lập số lượng nhỏ hơn ${thisOutfitSize.tonKho} khi tất cả trang phục chưa thu hồi`
      })
      selectedSize[size].quantity = thisOutfitSize.tonKho;
    }
  }
}
//FIXME: viết lại hàm này để kiểm tra tổng quát hết tất cả kích thước luôn. dùng outfitPiece
const updatePieceSize = () => {
  let thisOutfitSize = Object.assign({}, data.originOutfit.manhTrangPhucs.find(item => item.id == outfitPiece.id))
  if (thisOutfitSize.kichThuocs.some(item => {
    if (outfitPieceSize[item.maKichThuoc].quantity < item.tonKho && item.tonKho > item.soLuong) {
      outfitPieceSize[item.maKichThuoc].quantity = item.tonKho;
      return true;
    }
  })) {
    Toast.fire({
      icon: 'error',
      title: `Không thể thiết lập số lượng nhỏ hơn khi tất cả trang phục chưa được thu hồi`
    })
    return false;
  }
  return true;
}
watch(selectedSize, () => {
  if (notSize.value)
    data.outfit.kichThuocs = [];

}, {
  deep: true,
})
watch(() => data.outfit.manhTrangPhucs, value => {
  if (value.length > 0 && !data.outfit.hasPiece) {
    data.outfit.kichThuocs = [];
    data.outfit.kichThuocs.push({ maKichThuoc: "NONE", tonKho: 0 })
    data.outfit.hasPiece = true;
    data.outfit.tonKho = 0;
  }
  else if (value.length == 0 && data.outfit.hasPiece) {
    data.outfit.kichThuocs = []
    data.outfit.hasPiece = false;
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
const updatePiece = (index) => {
  updateIndex.value = index;
  outfitPiece.id = data.outfit.manhTrangPhucs[index].id;
  outfitPiece.tenTrangPhuc = data.outfit.manhTrangPhucs[index].tenTrangPhuc;
  outfitPiece.giaTien = data.outfit.manhTrangPhucs[index].giaTien;
  outfitPiece.kichThuocs = data.outfit.manhTrangPhucs[index].kichThuocs;
  outfitPiece.deleteKichThuoc = data.outfit.manhTrangPhucs[index].deleteKichThuoc;
  //reset status sizes
  Object.keys(outfitPieceSize).forEach(key => outfitPieceSize[key].checked = false);
  // add size for update
  outfitPiece.kichThuocs.forEach(outfitSize => {
    outfitPieceSize[outfitSize.maKichThuoc].checked = true;
    outfitPieceSize[outfitSize.maKichThuoc].quantity = outfitSize.tonKho;
  })
  dialog.value = true;
}
const addCategory = () => {
  data.category = JSON.parse(JSON.stringify(choosedCategory.value.at(0)));
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
const thisImage = reactive({
  index: 0,
  remove: []
})
const checkImage = (index) => {
  thisImage.index = index;
}
const removeImage = () => {
  thisImage.remove.push(images.value.at(thisImage.index));
  images.value.splice(thisImage.index, 1);
  thisImage.index++;
  if (thisImage.index >= images.value.length) thisImage.index = images.value.length - 1;
}
const deleteAll = () => {
  images.value = [];
}
const resetImage = () => {
  images.value.forEach((element) => {
    URL.revokeObjectURL(element.img);
  });
  thisImage.index = 0;
  thisImage.remove = [];
  images.value = data.outfit.hinhAnhs.map(item => {
    return {
      name: null,
      img: item,
      file: null,
    }
  })
};
const back = () => {
  router.back();
};
const removePiece = (item) => {
  deleteOutfitSize.value.push(item.id);
  data.outfit.manhTrangPhucs = data.outfit.manhTrangPhucs.filter(outfit => outfit.id != item.id);
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
  let temp = JSON.parse(JSON.stringify(outfitPiece))
  if (updateIndex.value != -1 && update) {
    if (!updatePieceSize()) return;
    let dataDump = JSON.parse(JSON.stringify(outfitStatic.value))
    let diffSize = dataDump.manhTrangPhucs.find(item => item.id == temp.id && !isInclude(item.kichThuocs.map(size => size.maKichThuoc), temp.kichThuocs.map(size => size.maKichThuoc)))
    if (diffSize) {
      let deleteSize = diffSize.kichThuocs.filter(size => !temp.kichThuocs.some(s => s.maKichThuoc == size.maKichThuoc))
      if (deleteSize.length) {
        temp.deleteKichThuoc = [];
        deleteSize.forEach(size => {
          temp.deleteKichThuoc.push(size.maKichThuoc);
        })
      }
    } else {
      temp.deleteKichThuoc = [];
    }
    data.outfit.manhTrangPhucs[updateIndex.value] = temp;
  } else
    data.outfit.manhTrangPhucs.push(temp);
  resetOutfitPiece();
}
const resetOutfitPiece = () => {
  outfitPiece.id = "";
  outfitPiece.tenTrangPhuc = "";
  outfitPiece.giaTien = 0;
  outfitPiece.kichThuocs = [];
  updateIndex.value = -1;

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
  if (notSize.value && !isAccessary.value && data.outfit.manhTrangPhucs.length == 0) {
    alert("Bạn phải chọn kích thước hoặc nhập số lượng");
    return;
  }
  // nếu là đạo cụ thì bắt buộc phải có số lượng
  if (isAccessary.value && data.tonKho <= 0) {
    alert("Bạn phải nhập số lượng cho đạo cụ");
    return;
  }
  // Trường hợp đó là phụ kiện hoặc trang phục có mảnh chuyển sang cái trang phục đơn (tức là lúc đầu kích thước là NONE )
  if (data.outfit.manhTrangPhucs.length == 0 && !isAccessary.value && data.originOutfit.kichThuocs.length ==1) {
    let size = Object.keys(selectedSize).map(key => {
      if (selectedSize[key].checked == true)
        return { maKichThuoc: key, tonKho: selectedSize[key].quantity };
    }).filter(item => item != undefined);
    if (!notSize.value) {
      if (size.some(item => item.tonKho <= 0)) {
        alert("Bạn phải nhập số lượng cho tất cả kích thước");
        return;
      }
    }
    data.outfit.kichThuocs = size;
  }
  //------------------------------------------------------------------------------------------------------------------------------------
  // Trường hợp ban đầu trang phục đó là trang phục bộ, đang muốn kiểm tra thay đổi kích thước
  if(data.outfit.manhTrangPhucs.length == 0 && data.originOutfit.kichThuocs.length >=1 && data.originOutfit.kichThuocs[0].maKichThuoc !="NONE") {
    console.log("log here");
    let size = Object.keys(selectedSize).map(key => {
      if (selectedSize[key].checked == true)
        return { maKichThuoc: key, tonKho: selectedSize[key].quantity };
    }).filter(item => item != undefined);
    if (!notSize.value) {
      if (size.some(item => item.tonKho <= 0)) {
        alert("Bạn phải nhập số lượng cho tất cả kích thước");
        return;
      }
    }
    let outfitData = JSON.parse(JSON.stringify(data.outfit))
    let originOutfit = JSON.parse(JSON.stringify(data.originOutfit))
    size.forEach(item => {
      let index = outfitData.kichThuocs.findIndex(dataSize=> dataSize.maKichThuoc == item.maKichThuoc);
      if(index!=-1) {
        data.outfit.kichThuocs[index].tonKho = item.tonKho;
      } else{
          data.outfit.kichThuocs.push(item);
      }
    })
    let deleteSize = originOutfit.kichThuocs.filter(originSize=> !size.some(i=> i.maKichThuoc == originSize.maKichThuoc));
      if(deleteSize.length) {
        let destroyedSize = deleteSize.map(item=>item.maKichThuoc);
        deleteSizes.value = destroyedSize;
        data.outfit.kichThuocs = data.outfit.kichThuocs.filter(size => !destroyedSize.includes(size.maKichThuoc));
      }
  }
//---------------------------------------------------------------------------------------------------------------------------------------------

  //NOTE: tạo một đối tượng mới nhân các thuộc tính của data.outfit
  let trangPhuc = Object.assign({}, data.outfit);
  if (JSON.stringify(data.outfit.manhTrangPhucs) == JSON.stringify(data.originOutfit.manhTrangPhucs)) {
    trangPhuc.manhTrangPhucs = [];
  }
  else {
    let update = data.outfit.manhTrangPhucs.filter(item => !data.originOutfit.manhTrangPhucs.some(o => JSON.stringify(o) == JSON.stringify(item)));
    trangPhuc.manhTrangPhucs = update;
    trangPhuc.deleteManhTrangPhuc = deleteOutfitSize.value;
  }
  // Nếu là đạo cụ và có sự thay đổi thì lấy số lượng gán cho trang phục
  if (isAccessary.value && trangPhuc.tonKho != data.originOutfit.tonKho) {
    trangPhuc.kichThuocs[0].tonKho = trangPhuc.tonKho;
  }
  // Nếu trang phục có kích thước không thay đổi gì thì chuyển kichThuoc = [] để không thực hiện cập nhật
  if (JSON.stringify(data.outfit.kichThuocs) == JSON.stringify(data.originOutfit.kichThuocs)) {
    trangPhuc.kichThuocs = [];
  } else {
    let update = data.outfit.kichThuocs.filter(item => !data.originOutfit.kichThuocs.some(o => JSON.stringify(o) == JSON.stringify(item)));
    trangPhuc.kichThuocs = update;
  }
  trangPhuc.deleteKichThuoc = deleteSizes.value;
  trangPhuc.tenTrangPhuc = trangPhuc.tenTrangPhuc.toLowerCase();
  // requestPending.pending = true;
  let uploadImg = images.value.map(item => item.file).filter(item => item);
  let removeImg = thisImage.remove.length > 0 ? thisImage.remove.map(item => item.img) : null;
  if (uploadImg.length == 0) uploadImg = null;
  if(!trangPhuc.deleteKichThuoc) trangPhuc.deleteKichThuoc = [];
  console.log(trangPhuc);
  updateOutfit(
     trangPhuc,
     uploadImg,
     removeImg,
   ).then((response) => {
     requestPending.pending = false;
     if (response.status == 200) {
       requestPending.success = true;
       requestPending.message = "Cập nhật sản phẩm thành công";
     } else {
       requestPending.error = true;
       requestPending.message = "Cập nhật sản phẩm thất bại";
     }
   });
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