<template>
  <div class="add-outfit-container container mt-5">
    <div class="add-outfit-wrap col-sm-10">
      <div class="add-outfit-header">
        <div class="header">
          <svg @click="back" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 30 24" fill="none"
            stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H6M12 5l-7 7 7 7" />
          </svg>
          <span>Thông tin trang phục</span>
        </div>
        <div class="add-action">
          <button class="add-submit" @click.prevent="addOufitHandle">
            Cập nhật
          </button>
        </div>
      </div>
      <div class="add-outfit-form mt-3">
        <div class="add-outfit-info col-sm-5">
          <div class="input-data outfit-name">
            <label for="outfitName">Tên sản phẩm</label>
            <input v-model="data.outfit.tenTrangPhuc" type="text" id="outfitName" />
          </div>
          <div class="input-data outfit-description">
            <label for="outfitDescription">Mô tả</label>
            <textarea v-model="data.outfit.moTa" id="outfitDescription" />
          </div>
          <div class="input-data outfit-category">
            <label for="category">Danh mục</label>
            <button data-bs-toggle="modal" data-bs-target="#chooseCategory">
              Chọn danh mục
            </button>
            <div id="category">
              {{ thisCategory?.tenLoai }}
            </div>
          </div>
          <div class="input-data outfit-price">
            <label for="outfitPrice">Giá tiền</label>
            <input v-model="data.outfit.giaTien" type="number" id="outfitPrice" />
          </div>
          <div class="outfit-size">
            <div>Kích thước</div>
            <!--NOTE: v-for size-->
            <div class="size">
              <label class="size-label" v-for="item in size" :key="item">
                <input v-model="selectedSize[item].checked" type="checkbox" class="input-size" :value="item" />
                <span class="size-checkbox"></span>
                <span>{{ item }}</span>
                <input v-model="selectedSize[item].quantity" class="quantity" type="number"
                  placeholder="số lượng ..." />
              </label>
              <div v-if="notSize" class="quantity-not-size">
                <label for="quantity-not-size">Số lượng</label>
                <input v-model="data.outfit.soLuong" id="quantity-not-size" type="number" placeholder="số lượng..." />
              </div>
            </div>
          </div>
        </div>
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
        </div>
    </div>
    <div class="modal fade" id="chooseCategory" tabindex="-1" aria-labelledby="chooseCategoryLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="chooseCategoryLabel">Thêm danh mục</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"  @click="resetCategory" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ul class="menu">
              <ListCategory v-for="c in category" :item="c" :key="c.maLoai" :single="true">
              </ListCategory>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="resetCategory" data-bs-dismiss="modal">
              Thoát
            </button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
              Chọn
            </button>
          </div>
        </div>
      </div>
    </div>
    <Loading v-if="requestPending.pending" />
    <Result v-if="requestPending.error || requestPending.success" :success="requestPending.success"
      :error="requestPending.error">
      <span>Thêm thành công !</span>
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
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { useRouter } from "vue-router";
import ListCategory from "@/components/Admin/ListCategory.vue";
import { useResource } from "@/stores/resource.store";
import { useAdminStore } from "@/stores/admin.store";
import { storeToRefs } from "pinia";
import { onBeforeMount, reactive, watch, ref, computed } from "vue";
import { getCategory, getUpdateOutfit } from "@/data.function/getData";
import { updateOutfit } from "@/data.function/postData";
import Notification from "@/components/Notification.vue";
import Loading from '@/components/Loading.vue';
import Result from '@/components/Admin/Result.vue';
const router = useRouter();
const resource = useResource();
const admin = useAdminStore();
const { choosedCategory } = storeToRefs(admin);
const { category } = storeToRefs(resource);
const size = ref(["S", "M", "L", "XL", "XXL"]);
const images = ref([]);
const selectedSize = reactive({
  S: { checked: false, quantity: 0 },
  M: { checked: false, quantity: 0 },
  L: { checked: false, quantity: 0 },
  XL: { checked: false, quantity: 0 },
  XXL: { checked: false, quantity: 0 },
});
const props = defineProps({
  id:{
    type: String,
    required: true
  }
})
const requestPending = reactive({
  pending: false,
  error: null,
  success: false,
  message: null,
});
const data = reactive({
  outfit:"",
  originOutfit:"",
});
function findCategoryById(root, maLoai) {
    if (root.maLoai === maLoai) {
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
const init = ref(true);
// eslint-disable-next-line vue/return-in-computed-property
const thisCategory = computed(()=>{
  if(choosedCategory.value.length >0) return choosedCategory.value.at(0);
  else {
    if(category.value.length>0 && data.outfit!="" && init.value) {
      console.log("log here ...");
    let temppCategory =null;
      let found = false;
      category.value.forEach(item=> {
        if(!found) {
        temppCategory = findCategoryById(item, data.outfit.theLoai);
        if(temppCategory) {
          found = true;
          init.value = false;
          admin.pushCategory(temppCategory);
        return temppCategory;
        }
      }
      })
    }
  }
})
const initCategory = () =>{
    if(category.value.length>0 && data.outfit!="") {
    let temppCategory =null;
      let found = false;
      category.value.forEach(item=> {
        if(!found) {
        temppCategory = findCategoryById(item, data.outfit.theLoai);
        if(temppCategory) {
          found = true;
          admin.pushCategory(temppCategory);
        return temppCategory;
        }
      }
      })
    }
}
onBeforeMount(() => {
  if(category.value.length == 0)
  getCategory().then((cat) => {
    resource.setCategory(cat);
  });
  getUpdateOutfit(props.id).then((outfit) => {
    data.outfit = outfit;
    data.originOutfit = outfit;
    if(outfit.kichThuocs && outfit.kichThuocs.length >0) {
      outfit.kichThuocs.forEach((item) => {
        let size = item.maKichThuoc;
        selectedSize[size].checked = true;
        selectedSize[size].quantity = item.soLuong;
      });
    }
    images.value = outfit.hinhAnhs.map(item => {
      return {
        name:null,
        img: item,
        file:null,
      }
    })
  });
  init.value = true;
});
const notSize = computed(() => {
  return size.value.every((element) => selectedSize[element].checked == false);
});
watch(
  selectedSize,
  (value) => {
    if (size.value.every((element) => value[element].checked == false)) {
      data.soLuong = 0;
      data.kichThuocs = [];
    }
  },
  {
    deep: true,
  }
);
const reset = ()=>{
  data.outfit = {...data.originOutfit };
  if(data.originOutfit.kichThuocs && data.originOutfit.kichThuocs.length >0) {
      data.originOutfit.kichThuocs.forEach((item) => {
        let size = item.maKichThuoc;
        selectedSize[size].checked = true;
        selectedSize[size].quantity = item.soLuong;
      });
    }
   init.value = true;
}
watch(
  requestPending,
  (value) => {
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
  },
  {
    deep: true,
  }
);
const resetCategory = () => {
  admin.resetCategory();
  init.value = true;
};

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
const thisImage =reactive({
  index:0,
  remove:[]
})
const checkImage =(index) =>{
  thisImage.index = index;
}
const removeImage = ()=>{
  thisImage.remove.push(images.value.at(thisImage.index));
  images.value.splice(thisImage.index, 1);
  thisImage.index++;
  if(thisImage.index >= images.value.length) thisImage.index = images.value.length - 1;
}
const deleteAll = ()=>{
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
        name:null,
        img: item,
        file:null,
      }
    })

};
const back = () => {
  router.back();
};
const addOufitHandle = () => {
  if (choosedCategory.value.length > 1 || choosedCategory.value.length == 0) {
    alert("Bạn phải chọn 1 danh mục");
    return;
  }
  if (images.value.length == 0) {
    alert("Bạn phải thêm ít nhất 1 ảnh");
    return;
  }
  if (notSize.value && data.soLuong == 0) {
    alert("Bạn phải chọn kích thước hoặc nhập số lượng");
    return;
  }
  let size = Object.keys(selectedSize)
    .map((key) => {
      if (selectedSize[key].checked == true)
        return { maKichThuoc: key, soLuong: selectedSize[key].quantity };
    })
    .filter((item) => item != undefined);
  if (!notSize.value) {
    if (!size.every((item) => item.soLuong > 0)) {
      alert("Bạn phải nhập số lượng cho tất cả kích thước");
      return;
    }
  }
  data.outfit.soLuong = notSize.value
    ? data.outfit.soLuong
    : size.map((item) => item.soLuong).reduce((total, item) => total + item);
    data.outfit.kichThuocs = [];
  size.forEach((item) => {
    data.outfit.kichThuocs.push(item);
  });
  requestPending.pending = true;
  let uploadImg = images.value.map(item => item.file).filter(item=> item);
  let removeImg = thisImage.remove.length > 0 ? thisImage.remove.map(item=> item.img):null;
  if(uploadImg.length == 0) uploadImg = null;
  updateOutfit(
    data.outfit,
    uploadImg,
    removeImg,
  ).then((response) => {
    requestPending.pending = false;
    if (response.status == 200) {
      requestPending.success = true;
      requestPending.message = "Thêm sản phẩm thành công";
    } else {
      requestPending.error = true;
      requestPending.message = "Thêm sản phẩm thất bại";
    }
  });
};
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

.add-outfit-image {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column
}
.add-action button{
  display:inline-block;
}
.add-outfit-image .upload-images-container {
  width: 200px;
  height: 300px;
  display: flex;
  justify-content: center;
  flex-direction: column;
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
  cursor: pointer;
}

.img-reset {
  top: -10px;
  left: -5px;
  cursor: pointer;
}
.remove-all-btn{
  width: 57%;
  margin-top: 12px;
  display: inline-block;
  cursor: pointer;
}
.remove-all-btn button{
  width: 100%;
  margin-top: 12px;
  padding:5px;
  display: inline-block;
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

.outfit-size .size {
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
</style>
