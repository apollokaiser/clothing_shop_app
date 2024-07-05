<template>
  <div>
    <div
      class="modal fade"
      id="addPromotion"
      tabindex="-1"
      aria-labelledby="addPromotionLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addPromotionLabel">Thêm khuyến mãi</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="col-sm-5">
              <form>
                <div class="mb-3">
                  <label for="tenKhuyenMai" class="form-label"
                    >Tên khuyến mãi</label
                  >
                  <input
                    v-model="promotion.tenKhuyenMai"
                    type="text"
                    class="form-control"
                    id="tenKhuyenMai"
                  />
                </div>
                <div class="mb-3">
                  <label for="moTa" class="form-label"
                    >Mô Tả</label
                  >
                  <input
                    v-model="promotion.moTa"
                    type="text"
                    class="form-control"
                    id="moTa"
                  />
                </div>
                <div class="mb-3">
                  <label for="formFile" class="form-label">Nội dung chính</label>
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
                      v-model="promotion.ngayBatDau"
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
                      v-model="promotion.ngayKetThuc"
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
                      v-model="promotion.soLuongToiThieu"
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
                      v-model="promotion.giaTriToiThieu"
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
                      v-model="promotion.phanTramGiam"
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
                      v-model="promotion.giamTien"
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
                      v-model="promotion.giamToiDa"
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
              class="description-content col-sm-5"
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
            <h5 class="modal-title" id="chooseCategoryLabel">Thêm danh mục</h5>
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
          <span>Thêm thành công</span>
        </template>
        <template v-slot:message>
          <span>Khuyến mãi được đã thêm !</span>
        </template>
      </Notification>
    </transition>
  </div>
</template>
<style lang="css" scoped>
.modal-body {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
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
import { onBeforeMount, reactive, ref, toRaw } from "vue";
import docx2html from "docx2html";
import { parse } from "node-html-parser";
import { useResource } from "@/stores/resource.store";
import { useAdminStore } from "@/stores/admin.store";
import ListCategory from "./ListCategory.vue";
import Notification from "../Notification.vue";
import { storeToRefs } from "pinia";
import { getCategory } from "@/data.function/getData";
import { addPromotion } from "@/data.function/postData";
const resource = useResource();
const admin = useAdminStore();
const { categoryPromotion } = storeToRefs(admin);
const { category } = storeToRefs(resource);
const htmlContent = ref(null);
const promotion = reactive({
  maKhuyenMai:"",
  tenKhuyenMai: "",
  moTa: "",
  noiDungChinh:"",
  ngayBatDau: new Date().toISOString().slice(0, 10),
  ngayKetThuc: new Date().toISOString().slice(0, 10),
  soLuongToiThieu: 0,
  giaTriToiThieu: 0,
  phanTramGiam: 0,
  giamTien: 0,
  giamToiDa: 0,
});
onBeforeMount(() => {
  getCategory().then((cat) => {
    category.value = cat;
  });
});
const getPromotion = (data) => {
  promotion.ngayBatDau = getDate(data[0]);
  promotion.ngayKetThuc = getDate(data[1]);
  promotion.phanTramGiam = data[2] == "" ? 0 : Number(data[2]);
  promotion.giamTien = data[3] == "" ? 0 : Number(data[3]);
  promotion.giamToiDa = data[4] == "" ? 0 : Number(data[4]);
  promotion.soLuongToiThieu = data[5] == "" ? 0 : Number(data[5]);
  promotion.giaTriToiThieu = data[6] == "" ? 0 : Number(data[6]);
};
const getDate = (date) => {
  let data = date.split("/");
  return `${data[2]}-0${data[1]}-0${data[0]}`;
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
    docx2html(file,{
      container:document.querySelector(".trash")
    }).then((html) => {
      const root = parse(html.toString());
      let table = root.querySelector("table").clone();
      let data = table
        .querySelectorAll("tbody tr:last-child td")
        .map((item) => item.innerText);
      root.querySelector("table").remove();
      htmlContent.value = root.querySelector("section").innerHTML;
      promotion.noiDungChinh = htmlContent.value;
      let title = root.querySelector(".Heading1").innerText.split("-");
      promotion.tenKhuyenMai = title[0].trim();
      promotion.moTa = title[1].trim();
      getPromotion(data);
      document.querySelector(".trash").innerHTML = "";
    });
  }
};
const removeAllCategory = () => {
  admin.resetCategory();
};
const savePromotion = () => {
  let savePromotion = toRaw(promotion);
  savePromotion.ngayBatDau =
    new Date(savePromotion.ngayBatDau).getTime() / 1000;
  savePromotion.ngayKetThuc =
    new Date(savePromotion.ngayKetThuc).getTime() / 1000;
  addPromotion(savePromotion, categoryPromotion.value).then((result) => {
    if (result !=false) {
      htmlContent.value = "";
      status.addPromotionSuccess = true;
      promotion.maKhuyenMai = result;
      resource.pushPromotion(toRaw(promotion));
      admin.resetCategory();
    } else {
      alert("Thêm thất bại!");
    }
  });
};
</script>
