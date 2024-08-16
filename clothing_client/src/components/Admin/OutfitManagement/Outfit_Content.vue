<template>
  <div class="outfit-content">
    <div class="outfit-wrap">
      <div class="outfit-news">
        <div class="outfit-search">
          <div class="choose-handle">
            <div>Danh sách trang phục</div>
            <div v-if="choosedOutfit.length" class=choose-action>
              <div>Đã chọn : <span>{{ choosedOutfit.length }}</span></div>
              <div @click="resetChoose" class="reset">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
                </svg>
              </div>
              <div @click="checlAll" class="choose-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </div>
            </div>
          </div>
          <div class="input-wrapper">
            <input v-model="findData.data" @keyup.enter="findOutfit" class="input-box" type="text"
              placeholder="Tìm kiếm ...">
            <span class="underline"></span>
          </div>
        </div>
        <div class="outfit-news-content">
          <OutfitDetail @delete="deleteOutfit" v-for="item in displayOutfit" :key="item.id" :outfit="item">
          </OutfitDetail>
          <div @click="loadMore" class="load-more">Xem thêm</div>
        </div>
        <Link :to="{ name: 'add-outfit' }">
        <div class="add-outfit">Thêm trang phục</div>
        </Link>

        <div v-if="updateOutfit && choosedOutfit.length" class="stop-business" @click="lockOufits">
          <span>Ngừng cho thuê</span>
        </div>
      </div>
    </div>
  </div>
  <div class="category-outfit">
    <div class="category-wrap">
      <div class="category-news">
        <div class="d-flex justify-content-between align-items-center">
          <span>Danh mục</span>
          <Link :to="{ name: 'admin-category' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 9.5H7M21 4.5H3M21 14.5H3M21 19.5H7" />
          </svg>
          </Link>
        </div>
        <div class="category-news-content">
          <div v-for="cat in category" class="category-news-item">
            <div class="category-descrition">{{ cat.tenLoai }}</div>
            <!-- <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                ></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Link from "@/components/Link.vue";
import { ROLES } from "@/utils/constant";
import { onBeforeMount, ref, computed, watch, reactive } from "vue";
import { authStore } from "@/stores/user.store";
import { useAdminStore } from "@/stores/admin.store";
import { storeToRefs } from "pinia";
import OutfitDetail from "./OutfitDetail.vue";
import { getOutfit, search, getCategory } from "@/data.function/getData";
import { lockOutfit, deleteOutfit as delOutfit } from "@/data.function/postData";
import Swal from "sweetalert2";
const auth = authStore();
const admin = useAdminStore();
const { user } = storeToRefs(auth);
const { choosedOutfit } = storeToRefs(admin);
const outfit = ref([])
const displayOutfit = ref([])
const findData = reactive({
  data: "",
  page: 0
});
const category = ref([])
const page = ref(0);
onBeforeMount(() => {
  getOutfit().then(response => {
    outfit.value = response;
    displayOutfit.value = outfit.value;
  })
  getCategory().then(response => {
    category.value = response;
  })
});
const loadMore = () => {
  page.value++;
  getOutfit(page.value).then(response => {
    if (response.length == 0) Swal.fire({
      title: "Thông báo",
      text: "Không còn sản phẩm",
      icon: "info",
      confirmButtonText: "Ok",
    })
    outfit.value = [...outfit.value, ...response];
    displayOutfit.value = [...outfit.value];
  })
}
const resetChoose = () => {
  admin.resetOutfit();
}
const checlAll = () => {
  admin.setAllOutfit(outfit.value.map(item => item.id))
}
const lockOufits = () => {
  lockOutfit(choosedOutfit.value).then(response => {
    if (response.status == 200) {
      alert("Ngừng kinh doanh thành công ")
    } else {
      alert("Lỗi khi ngừng kinh doanh ")
    }
  })
}
const updateOutfit = computed(() => {
  if (user.value.scope.includes(ROLES.ADMIN)) {
    let accept_role = [
      ROLES.SUPER_ACCOUNT,
      ROLES.FULL_CONTROL,
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
const deleteOutfit = (id) => {
  outfit.value = outfit.value.filter(item => item.id != id);
  displayOutfit.value = outfit.value;
  delOutfit(id).then(res => {
    if (!res) {
      Swal.fire({
        title: "Thông báo",
        text: "Xóa trang phục thất bại",
        icon: "info",
        confirmButtonText: "Ok",
      })
    } else {
      Swal.fire({
        title: "Thông báo",
        text: "Xóa trang phục thành công",
        icon: "success",
        confirmButtonText: "Ok",
      })
    }
  })
}
watch(() => findData.data, (newValue, oldValue) => {
  if (oldValue) {
    if (newValue == "" && oldValue != "") {
      findData.page = 0;
      displayOutfit.value = [...outfit.value];
    }
  }

})
const findOutfit = () => {
  if (findData.value == "") {
    alert("Vui lòng nhập tên muốn tìm")
  } else {
    // let keyword = normalizeString(findData.value);
    search(findData.data, findData.page).then(response => {
      if (response.status == 200) {
        if (response.data.trangphucs.length > 0)
          displayOutfit.value = [...response.data.trangphucs];
        else
          alert("Không tìm thấy trang phục nào")
      } else {
        alert("Không tìm thấy trang phục nào")
      }
      findData.page++;
    })
  }
}
</script>
<style scoped>
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(165, 165, 165);
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #435c70;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #50697f;
}

.outfit-content {
  width: 65%;
  padding: 20px;
}

.category-outfit {
  width: 35%;
  padding: 20px;
}

.outfit-wrap,
.category-wrap {
  background-color: #435c70;
  padding: 20px;
}

.category-news {
  width: 100%;
  font-family: sans-serif;
  padding: 1.5rem;
}

.category-news svg {
  cursor: pointer;
}

.outfit-news {
  width: 100%;
  font-family: sans-serif;
  padding: 1.5rem;
}

.outfit-news>div:first-child,
.category-news>div:first-child {
  font-weight: bold;
  font-size: 20px;
  color: #fff;
  margin-bottom: 12px;
  padding: 0 5px;
}

.outfit-news-content,
.category-news-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-start;
  height: 60vh;
  overflow: hidden;
  overflow-y: auto;
}

.load-more {
  display: inline-block;
  width: 100%;
  text-align: center;
  margin-top: 10px;
  padding: 5px;
  cursor: pointer;
  font-size: 14px;
  color: #ccc;
  transition: all .3s ease;
}

.load-more:hover {
  background-color: #435c86;
}

.outfit-search {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.choose-handle {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.choose-handle .choose-action {
  display: flex;
  gap: 5px;
  width: 200px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.choose-handle .choose-action div:not(:first-child) {
  background-color: #435c86;
  padding: 5px 10px;
  border-radius: 50%;
}

.choose-handle .choose-action div:not(:first-child):hover {
  background-color: #2b3b58;
}

.category-news-item {
  background-color: #50697f;
  padding: 15px;
  width: 100%;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.category-news-item>div:first-child {
  font-weight: bold;
}

.category-news-item>svg {
  padding: 5px;
  background-color: #435c70;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-news-item>svg:hover {
  background-color: #435c86;
}

.add-outfit,
.stop-business {
  background-color: #fff;
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: bold;
}

.stop-business {
  background-color: rgb(255, 106, 0);
}

.add-outfit:hover,
.stop-business:hover {
  background-color: orange;
  color: #fff;
}

.input-wrapper {
  position: relative;
  width: 200px;
}

.input-wrapper input::placeholder {
  color: #fff;
}

.input-box {
  font-size: 16px;
  padding: 10px 0;
  border: none;
  border-bottom: 2px solid #ccc;
  color: #fff;
  width: 100%;
  background-color: transparent;
  transition: border-color 0.3s ease-in-out;
}

.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #08AEEA;
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

.input-box:focus {
  border-color: #08AEEA;
  outline: none;
}

.input-box:focus+.underline {
  transform: scaleX(1);
}
</style>