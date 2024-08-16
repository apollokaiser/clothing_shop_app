<template>
  <div>
    <div>
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H6M12 5l-7 7 7 7"/></svg>
            <h5 class="modal-title" id="addPromotionLabel">
              Thông tin khuyến mãi
            </h5>
          </div>
          <div class="modal-body">
            <div class="col-sm-12">
              <form>
                <div class="mb-3">
                  <label for="tenKhuyenMai" class="form-label"
                    >Tên khuyến mãi</label
                  >
                  <input
                    v-model="promotion.item.tenKhuyenMai"
                    type="text"
                    class="form-control"
                    id="tenKhuyenMai"
                  />
                </div>
                <div class="mb-3">
                  <label for="moTa" class="form-label">Mô Tả</label>
                  <input
                    v-model="promotion.item.moTa"
                    type="text"
                    class="form-control"
                    id="moTa"
                  />
                </div>
                <div class="mb-3">
                  <label for="formFile" class="form-label"
                    >Nội dung chính</label
                  >
                  <input
                    class="form-control choose-file"
                    type="file"
                    id="formFile"
                    @change="convertToHTML"
                  />
                </div>
                <div class="d-flex justify-content-between">
                  <div class="mb-3 col-sm-5">
                    <label for="ngayBatDau" class="form-label"
                      >Ngày bắt đầu</label
                    >
                    <input
                      v-model="promotion.item.ngayBatDau"
                      type="date"
                      class="form-control"
                      id="ngayBatDau"
                    />
                  </div>
                  <div class="mb-3 col-sm-5">
                    <label for="ngayKetThuc" class="form-label"
                      >Ngày kết thúc</label
                    >
                    <input
                      v-model="promotion.item.ngayKetThuc"
                      type="date"
                      class="form-control"
                      id="ngayKetThuc"
                    />
                  </div>
                </div>
                <div class="d-flex justify-content-between">
                  <div class="mb-3 col-sm-5">
                    <label for="soLuongToiThieu" class="form-label"
                      >Số lượng tối thiểu</label
                    >
                    <input
                      v-model="promotion.item.soLuongToiThieu"
                      type="number"
                      class="form-control"
                      id="soLuongToiThieu"
                    />
                  </div>
                  <div class="mb-3 col-sm-5">
                    <label for="giaTriToiThieu" class="form-label"
                      >Giá trị tối thiểu</label
                    >
                    <input
                      v-model="promotion.item.giaTriToiThieu"
                      type="number"
                      class="form-control"
                      id="giaTriToiThieu"
                    />
                  </div>
                </div>
                <div class="d-flex justify-content-between flex-wrap">
                  <div class="mb-3 col-sm-5">
                    <label for="phanTramGiam" class="form-label"
                      >Phần trăm giảm</label
                    >
                    <input
                      v-model="promotion.item.phanTramGiam"
                      type="number"
                      class="form-control"
                      id="phanTramGiam"
                    />
                  </div>
                  <div class="mb-3 col-sm-5">
                    <label for="giaTriGiam" class="form-label"
                      >Giá trị giảm</label
                    >
                    <input
                      v-model="promotion.item.giamTien"
                      type="number"
                      class="form-control"
                      id="giaTriGiam"
                    />
                  </div>
                  <div class="mb-3 col-sm-5">
                    <label for="giamToiDa" class="form-label"
                      >Giá trị tối đa</label
                    >
                    <input
                      v-model="promotion.item.giamToiDa"
                      type="number"
                      class="form-control"
                      id="giamToiDa"
                    />
                  </div>
                </div>
              </form>
              <!-- <div class="mb-3 col-sm-5 d-flex flex-column">
                <label for="" class="form-label">Chọn danh mục</label>
                <button
                  type="submit"
                  class="btn btn-success"
                  data-bs-toggle="modal"
                  data-bs-target="#chooseCategory"
                >
                  Thêm ngay
                </button>
              </div> -->
              <div class="mb-3 col-sm-12 d-flex justify-content-between align-items-center">
                <div class="col-sm-5 d-flex flex-column">
                  <label for="" class="form-label">Chọn danh mục</label>
                  <button type="submit" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#chooseCategory">
                    Thêm ngay
                  </button>
                </div>
                <div class="selected-category col-sm-5 d-flex flex-column">
                  <div>Danh mục được chọn:</div>
                  <v-chip-group selected-class="text-primary" column>
                    <v-chip v-for="category in promotionCategory" :key="category" @click:close="removeCategory(category.maLoai)" closable class="ma-2" color="teal"> {{ category.tenLoai }} </v-chip>
                  </v-chip-group>
                </div>
              </div>
            </div>
            <div
              class="description-content col-sm-12"
              v-html="htmlContent"
            ></div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              @click="savePromotion"
              type="button"
              class="btn btn-primary"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="chooseCategory"
      tabindex="-1"
      aria-labelledby="chooseCategoryLabel"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="chooseCategoryLabel">Danh mục</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <ul class="menu">
              <ListCategory v-for="c in category" :item="c" :key="c.maLoai">
              </ListCategory>
            </ul>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Thoát
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click.prevent="addPromotionCategory"
            >
              Chọn
            </button>
          </div>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <Notification v-if="status.addPromotionSuccess">
        <template v-slot:title>
          <span>Cập nhật thành công</span>
        </template>
        <template v-slot:message>
          <span>Khuyến mãi đã được làm mới !</span>
        </template>
      </Notification>
    </transition>
  </div>
</template>
<style lang="css" scoped>
.modal-fullscreen {
  width: 100%;
}
.modal-body {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
#chooseCategory .modal-body {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}
ul.menu {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  flex-direction: column;
}
ul.menu > li > {
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
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
<script setup>
import { computed, onBeforeMount, reactive, ref, toRaw, watch } from "vue";
import docx2html from "docx2html";
import { parse } from "node-html-parser";
import { useResource } from "@/stores/resource.store";
import { useAdminStore } from "@/stores/admin.store";
import ListCategory from "@/components/Admin/ListCategory.vue";
import Notification from "@/components/Notification.vue";
import { storeToRefs } from "pinia";
import { getCategory,getCategoryInPromotion } from "@/data.function/getData";
import { updatePromotion } from "@/data.function/postData";
import Swal from "sweetalert2";
import { Toast } from "@/utils/notification";
import { findCategoryById } from "@/utils/util.function";
const resource = useResource();
const admin = useAdminStore();
const { choosedCategory } = storeToRefs(admin);
const { category, promotions } = storeToRefs(resource);
const htmlContent = ref(null);
let checkBlank = ['tenKhuyenMai', 'moTa', 'noidungChinh'];
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});
const promotion = reactive({
  item: {},
});
const promotionCategory = ref([]);
const categoryInPromotion = ref([]);
onBeforeMount(async() => {
 const response = await getCategory()
    category.value = response;
    promotion.item = resource.getPromotion(props.id);
    promotion.item.ngayBatDau = getDateInit(promotion.item.ngayBatDau);
    promotion.item.ngayKetThuc = getDateInit(promotion.item.ngayKetThuc);
 const result = await  getCategoryInPromotion(props.id)
    categoryInPromotion.value = result;
    if(categoryInPromotion.value.length){
    promotionCategory.value = categoryInPromotion.value.map(item => {
      let temp = null;
      category.value.forEach(value =>{
        if(!temp) temp = findCategoryById(value, item);
      })
      if(temp) return temp;
    });
    choosedCategory.value = JSON.parse(JSON.stringify(promotionCategory.value));
  }
});
watch(()=>promotions.value,
  () => {
    if(!promotion.item.maKhuyenMai){
      promotion.item = resource.getPromotion(props.id);
      promotion.item.ngayBatDau = getDateInit(promotion.item.ngayBatDau);
      promotion.item.ngayKetThuc = getDateInit(promotion.item.ngayKetThuc);
    }
  },
  {
    deep: true,
  }
);
// watch(() => categoryInPromotion.value, () =>{
//   if(categoryInPromotion.value.length){
//     promotionCategory.value = categoryInPromotion.value.map(item => {
//       category.value.forEach(value =>{
//         let temp = findCategoryById(value, item);
//         if(temp)
//         return temp;
//       })
//     });
//     choosedCategory.value = JSON.parse(JSON.stringify(promotionCategory.value));
//   }
// }, {
//   deep: true,
// })
const removeCategory = (id) =>{
  promotionCategory.value = promotionCategory.value.filter(p=> p.maLoai !=id);
  choosedCategory.value = JSON.parse(JSON.stringify(promotionCategory.value));
}
const addPromotionCategory = () =>{
  promotionCategory.value  =  JSON.parse(JSON.stringify(choosedCategory.value))
}
const getPromotion = (data) => {
  promotion.item.ngayBatDau = getDate(data[0]);
  promotion.item.ngayKetThuc = getDate(data[1]);
  promotion.item.phanTramGiam = data[2] == "" ? 0 : Number(data[2]);
  promotion.item.giamTien = data[3] == "" ? 0 : Number(data[3]);
  promotion.item.giamToiDa = data[4] == "" ? 0 : Number(data[4]);
  promotion.item.soLuongToiThieu = data[5] == "" ? 0 : Number(data[5]);
  promotion.item.giaTriToiThieu = data[6] == "" ? 0 : Number(data[6]);
};
const getDate = (date) => {
  if (date == 0) return 0;
  let data = date.split("/");
  let month = data[1] >= 10 ? data[1] : `0${data[1]}`;
  let day = data[0] >= 10 ? data[0] : `0${data[0]}`;
  return `${data[2]}-${month}-${day}`;
};
const getDateInit = (data) => {
  let date = new Date(data * 1000);
  if (data == 0) return 0;
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (day < 10) day = `0${day}`;
  if (month < 10) month = `0${month}`;
  console.log(`${year}-${month}-${day}`);
  return `${year}-${month}-${day}`;
};
const status = reactive({
  addPromotionSuccess: false,
});
const convertToHTML = (event) => {
  const file = event.target.files[0];
  if (
    file &&
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    docx2html(file, {
      container: document.querySelector(".trash"),
    }).then((html) => {
      const root = parse(html.toString());
      let table = root.querySelector("table").clone();
      let data = table
        .querySelectorAll("tbody tr:last-child td")
        .map((item) => item.innerText);
      root.querySelector("table").remove();
      htmlContent.value = root.querySelector("section").innerHTML;
      promotion.item.noiDungChinh = htmlContent.value;
      let title = root.querySelector(".Heading1").innerText.split("-");
      promotion.item.tenKhuyenMai = title[0].trim();
      promotion.item.moTa = title[1].trim();
      getPromotion(data);
      document.querySelector(".trash").innerHTML = "";
    });
  }
};
const isValidData = computed(()=>{
  let isValid = Object.keys(promotion.item).some(key =>{
    if(checkBlank.includes(key) && promotion.item[key] == "") return false;
    return true;
  })
  if((promotion.item.soLuongToiThieu >0 && promotion.item.giaTriToiThieu >0) || (promotion.item.giamTien >0 && promotion.item.phanTramGiam >0)) {
   isValid = false;
  }
  // trường hợp nãy sẽ catch nếu cả 2 bằng 0
  if(promotion.item.giamTien == promotion.item.phanTramGiam) isValid = false;
  return isValid;
})
const checkPromotionDate = computed(()=>{
  const now = new Date();
  console.log(new Date(promotion.item.ngayBatDau));
  const startDate = new Date(promotion.item.ngayBatDau);
  const endDate = new Date(promotion.item.ngayKetThuc);
  return (now >= startDate || startDate > now) && now <= endDate;
})
const deleteCategories = computed(()=>{
  if(categoryInPromotion.value.length){
   return categoryInPromotion.value.filter(item=> !promotionCategory.value.some(p=> p.maLoai == item)).map(item=> item.maLoai);
  } 
  return [];
})
const savePromotion = () => {
  if(!checkPromotionDate.value) {
    Toast.fire({
                icon: 'error',
                title: 'Thời gian diễn ra khuyến mãi không hợp lệ !'
            })
            return;
  }
  if(!isValidData.value) {
    Toast.fire({
                icon: 'error',
                title: 'Dữ liệu nhập không hợp lệ !'
            })
            return;
  }
  let pCategory = promotionCategory.value.map(item=> item.maLoai);
  //Lấy danh sách categories id mà lúc đầu không có
  let insertCategory = []
  if(categoryInPromotion.value){
    if(JSON.stringify(pCategory) == JSON.stringify(categoryInPromotion.value)) {
      insertCategory = []
  } else 
    insertCategory = categoryInPromotion.value.length ?  pCategory.filter(item=> !categoryInPromotion.value.includes(item)) : pCategory
  }
  //lấy danh sách categories id mà lúc đầu có mà lúc sau không có (tức là bị xóa mất)
  let savePromotion = toRaw(promotion.item);
  savePromotion.ngayBatDau =
    new Date(savePromotion.ngayBatDau).getTime() / 1000;
  savePromotion.ngayKetThuc =
    new Date(savePromotion.ngayKetThuc).getTime() / 1000;
    updatePromotion(savePromotion, insertCategory, deleteCategories.value).then((result) => {
    if (result != false) {
      htmlContent.value = "";
      status.addPromotionSuccess = true;
      resource.removePromotion(props.id);
      resource.pushPromotion(toRaw(promotion.item));
      admin.resetCategory();
    } else {
      Swal.fire({
        title: "Lỗi",
        text: "Không thể cập nhật khuyến mãi",
        icon: "error",
        confirmButtonText: "Đã hiểu",
      })
    }
  });
};
</script>
