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
              <div class="mb-3 col-sm-5 d-flex flex-column">
                <label for="" class="form-label">Chọn danh mục</label>
                <button
                  type="submit"
                  class="btn btn-success"
                  data-bs-toggle="modal"
                  data-bs-target="#chooseCategory"
                >
                  Thêm ngay
                </button>
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
              @click="removeAllCategory"
              data-bs-dismiss="modal"
            >
              Thoát
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
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
import { onBeforeMount, reactive, ref, toRaw, watch } from "vue";
import docx2html from "docx2html";
import { parse } from "node-html-parser";
import { useResource } from "@/stores/resource.store";
import { useAdminStore } from "@/stores/admin.store";
import ListCategory from "./ListCategory.vue";
import Notification from "../Notification.vue";
import { storeToRefs } from "pinia";
import { getCategory,getCategoryInPromotion } from "@/data.function/getData";
import { addPromotion } from "@/data.function/postData";
const resource = useResource();
const admin = useAdminStore();
const { categoryPromotion } = storeToRefs(admin);
const { category, promotions } = storeToRefs(resource);
const htmlContent = ref(null);
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});
const promotion = reactive({
  item: {},
});
const categoryInPromotion = ref(null);
onBeforeMount(() => {
  getCategory().then((cat) => {
    category.value = cat;
    promotion.item = resource.getPromotion(props.id);
    promotion.item.ngayBatDau = getDateInit(promotion.item.ngayBatDau);
    promotion.item.ngayKetThuc = getDateInit(promotion.item.ngayKetThuc);
  });
});
watch(
  promotions,
  (value) => {
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

watch(()=> promotion, value=>{
  if(value.item.maKhuyenMai){
   getCategoryInPromotion(props.id).then(result=>{
    categoryInPromotion.value = result;
   })
  }
})
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
  let data = date.split("/");
  return `${data[2]}-0${data[1]}-0${data[0]}`;
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
const removeAllCategory = () => {
  admin.resetCategory();
};
const savePromotion = () => {
  let savePromotion = toRaw(promotion.item);
  savePromotion.ngayBatDau =
    new Date(savePromotion.ngayBatDau).getTime() / 1000;
  savePromotion.ngayKetThuc =
    new Date(savePromotion.ngayKetThuc).getTime() / 1000;
  addPromotion(savePromotion, categoryPromotion.value).then((result) => {
    if (result != false) {
      htmlContent.value = "";
      status.addPromotionSuccess = true;
      resource.removePromotion(props.id);
      resource.pushPromotion(toRaw(promotion.item));
      admin.resetCategory();
    } else {
      alert("Thêm thất bại!");
    }
  });
};
</script>
