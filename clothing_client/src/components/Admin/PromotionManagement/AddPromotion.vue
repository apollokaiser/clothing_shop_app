<template>
  <div>
    <div class="modal fade" id="addPromotion" tabindex="-1" aria-labelledby="addPromotionLabel" aria-hidden="true">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addPromotionLabel">Thêm khuyến mãi</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="col-sm-5">
              <form>
                <div class="mb-3">
                  <label for="tenKhuyenMai" class="form-label">Tên khuyến mãi</label>
                  <input v-model="promotion.tenKhuyenMai" type="text" class="form-control" id="tenKhuyenMai" />
                </div>
                <div class="mb-3">
                  <label for="moTa" class="form-label">Mô Tả</label>
                  <input v-model="promotion.moTa" type="text" class="form-control" id="moTa" />
                </div>
                <div class="mb-3">
                  <label for="formFile" class="form-label">Nội dung chính</label>
                  <input class="form-control choose-file" type="file" id="formFile" @change="convertToHTML" />
                </div>
                <div class="d-flex justify-content-between">
                  <div class="mb-3 col-sm-5">
                    <label for="ngayBatDau" class="form-label">Ngày bắt đầu</label>
                    <input v-model="promotion.ngayBatDau" type="date" :min="minDate" class="form-control" id="ngayBatDau" />
                  </div>
                  <div class="mb-3 col-sm-5">
                    <label for="ngayKetThuc" class="form-label">Ngày kết thúc</label>
                    <input v-model="promotion.ngayKetThuc" type="date" :min="minDate" class="form-control" id="ngayKetThuc" />
                  </div>
                </div>
                <div class="d-flex justify-content-between">
                  <div class="mb-3 col-sm-5">
                    <label for="soLuongToiThieu" class="form-label">Số lượng tối thiểu</label>
                    <input v-model="promotion.soLuongToiThieu" :disabled="promotion.giaTriToiThieu >0" type="number" class="form-control"
                      id="soLuongToiThieu" />
                  </div>
                  <div class="mb-3 col-sm-5">
                    <label for="giaTriToiThieu" class="form-label">Giá trị tối thiểu</label>
                    <input v-model="promotion.giaTriToiThieu" :disabled="promotion.soLuongToiThieu > 0" type="number" class="form-control" id="giaTriToiThieu" />
                  </div>
                </div>
                <div class="d-flex justify-content-between flex-wrap">
                  <div class="mb-3 col-sm-5">
                    <label for="phanTramGiam" class="form-label">Phần trăm giảm</label>
                    <input v-model="promotion.phanTramGiam" :disabled="promotion.giamTien > 0" type="number" class="form-control" id="phanTramGiam" />
                  </div>
                  <div class="mb-3 col-sm-5">
                    <label for="giaTriGiam" class="form-label">Giá trị giảm</label>
                    <input v-model="promotion.giamTien" :disabled="promotion.phanTramGiam > 0" type="number" class="form-control" id="giaTriGiam" />
                  </div>
                  <div class="mb-3 col-sm-5">
                    <label for="giamToiDa" class="form-label">Giá trị tối đa</label>
                    <input v-model="promotion.giamToiDa" type="number" class="form-control" id="giamToiDa" />
                  </div>
                </div>
              </form>
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
            <div class="description-content col-sm-5" v-html="htmlContent"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button @click.prevent="savePromotion" type="button" class="btn btn-primary">
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="chooseCategory" tabindex="-1" aria-labelledby="chooseCategoryLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="chooseCategoryLabel">Thêm danh mục</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ul class="menu">
              <ListCategory v-for="c in category" :item="c" :key="c.maLoai">
              </ListCategory>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="removeAllCategory" data-bs-dismiss="modal">
              Thoát
            </button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click.prevent="addPromotionCategory">
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
import { computed, onBeforeMount, reactive, ref, toRaw } from "vue";
import docx2html from "docx2html";
import { parse } from "node-html-parser";
import { useResource } from "@/stores/resource.store";
import { useAdminStore } from "@/stores/admin.store";
import ListCategory from "@/components/Admin/ListCategory.vue";
import Notification from "@/components/Notification.vue";
import { storeToRefs } from "pinia";
import { getCategory } from "@/data.function/getData";
import { addPromotion } from "@/data.function/postData";
import Swal from "sweetalert2";
import { Toast } from "@/utils/notification";
const resource = useResource();
const admin = useAdminStore();
const { choosedCategory } = storeToRefs(admin);
const { category } = storeToRefs(resource);
const htmlContent = ref(null);
let checkBlank = ['tenKhuyenMai', 'moTa', 'noidungChinh'];
const promotion = reactive({
  maKhuyenMai: "",
  tenKhuyenMai: "",
  moTa: "",
  noiDungChinh: "",
  ngayBatDau: new Date().toISOString().slice(0, 10),
  ngayKetThuc: new Date().toISOString().slice(0, 10),
  soLuongToiThieu: 0,
  giaTriToiThieu: 0,
  phanTramGiam: 0,
  giamTien: 0,
  giamToiDa: 0,
});
const minDate = ref(new Date().toISOString().split('T')[0]);
const promotionCategory = ref([]);
onBeforeMount(() => {
  getCategory().then((cat) => {
    category.value = cat;
  });
});
const checkPromotionDate = computed(()=>{
  const now = new Date();
  console.log(new Date(promotion.ngayBatDau));
  const startDate = new Date(promotion.ngayBatDau);
  const endDate = new Date(promotion.ngayKetThuc);
  return (now >= startDate || startDate > now) && now <= endDate;
})
const addPromotionCategory = () =>{
  promotionCategory.value = JSON.parse(JSON.stringify(choosedCategory.value));
}
const removeCategory = (id) => {
  choosedCategory.value = choosedCategory.value.filter(category => category.maLoai != id);
  addPromotionCategory();
}
const getPromotion = (data) => {
  promotion.ngayBatDau = getDate(data[0]);
  promotion.ngayKetThuc = getDate(data[1]);
  promotion.phanTramGiam = data[2] == "" ? 0 : Number(data[2]);
  promotion.giamTien = data[3] == "" ? 0 : Number(data[3]);
  promotion.giamToiDa = data[4] == "" ? 0 : Number(data[4]);
  promotion.soLuongToiThieu = data[5] == "" ? 0 : Number(data[5]);
  promotion.giaTriToiThieu = data[6] == "" ? 0 : Number(data[6]);
};
//FIXED: đã sửa định dạng ngày tháng ngày tháng và trường hợp ngày tháng = 0;
const getDate = (date) => {
  if (date == 0) return 0;
  let data = date.split("/");
  let month = data[1] >= 10 ? data[1] : `0${data[1]}`;
  let day = data[0] >= 10 ? data[0] : `0${data[0]}`;
  return `${data[2]}-${month}-${day}`;
};
const status = reactive({
  addPromotionSuccess: false,
});
const isValidData = computed(()=>{
  let isValid = Object.keys(promotion).some(key =>{
    if(checkBlank.includes(key) && promotion[key] == "") return false;
    return true;
  })
  if((promotion.soLuongToiThieu >0 && promotion.giaTriToiThieu >0) || (promotion.giamTien >0 && promotion.phanTramGiam >0)) {
   isValid = false;
  }
  // trường hợp nãy sẽ catch nếu cả 2 bằng 0
  if(promotion.giamTien == promotion.phanTramGiam) isValid = false;
  return isValid;
})
const convertToHTML = (event) => {
  const file = event.target.files[0];
  if (
    file &&
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    docx2html(file, {
      container: document.querySelector(".trash")
    }).then((html) => {
      let root = parse(html.toString());
      let table = root.querySelector("table").clone();
      let data = table
        .querySelectorAll("tbody tr:last-child td")
        .map((item) => item.innerText);
      root.querySelector("table").remove();
      htmlContent.value = root.querySelector("section").innerHTML;
      promotion.noiDungChinh = htmlContent.value;
      let title = root.querySelector(".Heading1")?.innerText.split("-");
      promotion.tenKhuyenMai = title[0]?.trim();
      promotion.moTa = title[1]?.trim();
      getPromotion(data);
      document.querySelector(".trash").innerHTML = "";
    });
  }
};
const removeAllCategory = () => {
  admin.resetCategory();
};
//FIXME: xem lại thêm khuyến mãi khi hết access token có trả về promotion_id không
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
  promotion.maKhuyenMai = ""
  let savePromotion = toRaw(promotion);
  savePromotion.ngayBatDau =
    new Date(savePromotion.ngayBatDau).getTime() / 1000;
  savePromotion.ngayKetThuc =
    new Date(savePromotion.ngayKetThuc).getTime() / 1000;
  addPromotion(savePromotion, choosedCategory.value.map(item => item.maLoai)).then((result) => {
    htmlContent.value = "";
    console.log(result);
    if (result && result != false) {
      status.addPromotionSuccess = true;
      promotion.maKhuyenMai = result;
      resource.pushPromotion(toRaw(promotion));
      admin.resetCategory();
    } else {
      Swal.fire({
        icon: "error",
        title: "Thêm thất bại",
        text: "Không thể thêm khuyến mãi, vui lòng thử lại sau!",
        confirmButtonText: "OK"
      })
    }
  });
};
</script>
