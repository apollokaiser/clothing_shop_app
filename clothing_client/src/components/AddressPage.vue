<template>
  <div class="container address-container">
    <div class="address-header">
      <i @click="back" class="fa fa-long-arrow-left me-2" aria-hidden="true"></i>
      <div>Thông tin địa chỉ</div>
    </div>
    <div v-if="user.address.length == 0" class="no-address mt-3">
      <i class="fa fa-map-marker-alt me-2" aria-hidden="true"></i>
      Không tìm thấy địa chỉ nào
    </div>
    <div v-else class="has-address">
      <AddressItem @showMessage="getMessage" v-for="address in user.address" :key="address" :address="address" />
    </div>
    <div class="add-address">
      <button @click="loadCity" data-bs-toggle="modal" data-bs-target="#exampleModal" class="add-address-btn">
        Thêm địa chỉ mới
      </button>
    </div>
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Thêm địa chỉ mới
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="address-name">
              <div>Tên địa chỉ</div>
              <div class="address-add-input">
                <input v-model="address.name" type="text" class="form-control"
                  placeholder="Tên gợi nhớ (ví dụ: tại nhà)" />
              </div>
            </div>
            <div class="address-detail">
              <select v-model="address.provinceId" class="form-select" aria-label="Default select example">
                <option selected>Tỉnh, thành phố</option>
                <option v-for="province in city.province" :key="province.province_id" :value="province.province_id">
                  {{ province.province_name }}
                </option>
              </select>
              <select v-model="address.districtId" class="form-select" aria-label="Default select example">
                <option selected>Quận, huyện</option>
                <option v-for="district in city.district" :key="district.district_id" :value="district.district_id">
                  {{ district.district_name }}
                </option>
              </select>
              <select v-model="address.wardId" class="form-select" aria-label="Default select example">
                <option selected>Xã phường</option>
                <option v-for="ward in city.ward" :key="ward.ward_id" :value="ward.ward_id">
                  {{ ward.ward_name }}
                </option>
              </select>
            </div>
            <div class="location-detail">
              <div>Địa chỉ chi tiết</div>
              <div class="address-add-input">
                <input v-model="addressName.addressDetail" type="text" class="form-control"
                  placeholder="Số nhà,tên đường,..." />
              </div>
            </div>
            <div class="form-check">
              <input v-model="address.isDefault" class="form-check-input" type="checkbox" value="" id="check-default" />
              <label class="form-check-label" for="check-default">
                Đặt làm mặc định
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Hủy
            </button>
            <button @click.prevent="addAddress" data-bs-dismiss="modal" type="button"
              class="btn btn-primary">Thêm</button>
          </div>
        </div>
      </div>
    </div>
    <Transition name="fade">
      <div v-if="action.showMessage" class="notification">
        <div class="loading"></div>
        <div v-if="action.success" class="success">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none"
            stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path
              d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3">
            </path>
          </svg>
          <span>{{ action.message }}</span>
        </div>
        <div v-else class="error">
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none"
            stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path
              d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17">
            </path>
          </svg>
          <span>{{ action.message }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import {
  getDistricts,
  getProvinces,
  getWards,
} from "@/data.function/vnapis.get";
import { reactive, watch } from "vue";
import { authStore } from "@/stores/user.store";
import { storeToRefs } from "pinia";
import AddressItem from "./AddressItem.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const auth = authStore();
const { user } = storeToRefs(auth);
const action = reactive({
  showMessage: false,
  success: false,
  message: "",
  showUpdate: false
})
const address = reactive({
  id: 0,
  name: "",
  address: "",
  isDefault: false,
  provinceId: "",
  districtId: "",
  wardId: "",
});
const addressName = reactive({
  provinceName: "",
  districtName: "",
  wardName: "",
  addressDetail: ""
})
const city = reactive({
  province: [],
  district: [],
  ward: [],
});
const loadCity = async () => {
  getProvinces().then((response) => {
    city.province = response;
  });
};
watch(
  () => address.provinceId,
  (value) => {
    getDistricts(value).then((response) => {
      city.district = response;
    });
    addressName.provinceName = city.province.find(province => province.province_id == value).province_name;
  },
  {
    deep: true,
  }
);
watch(
  () => address.districtId,
  (value) => {
    getWards(value).then((response) => {
      city.ward = response;
    });
    addressName.districtName = city.district.find(district => district.district_id == value).district_name;
  },
  {
    deep: true,
  }
);
watch(() => address.wardId,
  (value) => {
    addressName.wardName = city.ward.find(ward => ward.ward_id == value).ward_name;
  }, {
  deep: true,
})
const addAddress = () => {
  address.address = addressName.addressDetail + ", " + addressName.wardName + ", " + addressName.districtName + ", " + addressName.provinceName;
  let duplicateAddress = user.value.address.find(item => item.diaChi == address.address.trim())
  if (duplicateAddress) {
    action.showMessage = true;
    action.success = false;
    action.message = "Địa chỉ đã tồn tại";
    return;
  }
  auth.addNewAddress(address).then(result => {
    if (result) {
      action.showMessage = true;
      action.success = true;
      action.message = "Thêm mới thành công";
    }
    else {
      action.showMessage = true;
      action.success = false;
      action.message = "Thêm mới thất bại";
    }
  })
}
const back = () => {
  router.back();
}
const getMessage = (data) => {
  action.showMessage = data.showMessage;
  action.message = data.message;
  action.success = data.success;
}
watch(() => action.showMessage, (value) => {
  if (value) {
    setTimeout(() => {
      action.showMessage = false;
      action.success = false;
      action.message = "";
    }, 3000)
  }
})
</script>
<style scoped>
.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f8f9fa;
  font-size: 24px;
  border-bottom: 1px solid #dee2e6;
  font-style: italic;
}

.address-header>i {
  cursor: pointer;
}

.no-address {
  width: 100%;
  margin: 0 auto;
}

.has-address {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  overflow: auto;
  max-height: 400px;
}

.add-address {
  margin-top: 10px;
  width: 100%;
}

.add-address button {
  display: inline-block;
  width: 100%;
  padding: 5px 5px;
  border: 1px solid #ccc;
  outline: none;
  background-color: #ee58a6;
  color: #dee2e6;
  font-family: monospace, sans-serif;
  border-radius: 5px;
}

.address-detail {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  margin: 15px;
  flex-wrap: wrap;
}

.address-detail select {
  margin-top: 12px;
}

.address-name>div:first-child {
  font-weight: bold;
  font-size: 17px;
}

.modal-body .address-name {
  margin: 12px;
}

.address-name {
  position: relative;
}

.address-name .address-add-input {
  width: 100%;
  position: relative;
}

.address-name .address-add-input::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: #3f9efd;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.address-name .address-add-input:has(input:focus)::after {
  opacity: 1;
}

.address-name input:focus {
  box-shadow: none;
  border: none;
}

.location-detail {
  margin: 15px;
}

.modal {
  font-family: sans-serif;
}

.notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 200px;
  height: 200px;
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  border-radius: 5px;
}

.notification .success,
.notification .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.notification .success svg,
.notification .error svg {
  fill: #fff;
  animation: pop-up 0.5s infinite linear;
}

@keyframes pop-up {
  0% {
    transform: rotate(-20deg);
  }

  50% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: rotate(-20deg);
  }
}
</style>
