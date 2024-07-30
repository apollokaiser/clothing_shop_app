<template>
    <div class="modal fade" :id="props.idModal" tabindex="-1" aria-labelledby="updateAdressLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="updateAdressLabel">
                        Cập nhật thông tin địa chỉ
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="address-name">
                        <div>Tên địa chỉ</div>
                        <div class="address-add-input">
                            <input v-model="addressInfo.tenDiaChi" type="text" class="form-control"
                                placeholder="Tên gợi nhớ (ví dụ: tại nhà)" />
                        </div>
                    </div>
                    <div class="address-detail">
                        <select v-model="addressInfo.detail.provinceId" class="form-select" aria-label="Default select example">
                            <option selected>Tỉnh, thành phố</option>
                            <option v-for="province in city.province" :key="province.province_id"
                                :value="province.province_id">
                                {{ province.province_name }}
                            </option>
                        </select>
                        <select v-model="addressInfo.detail.districtId" class="form-select" aria-label="Default select example">
                            <option selected>Quận, huyện</option>
                            <option v-for="district in city.district" :key="district.district_id"
                                :value="district.district_id">
                                {{ district.district_name }}
                            </option>
                        </select>
                        <select v-model="addressInfo.detail.wardId" class="form-select" aria-label="Default select example">
                            <option selected>Xã phường</option>
                            <option v-for="ward in city.ward" :key="ward.ward_id" :value="ward.ward_id">
                                {{ ward.ward_name }}
                            </option>
                        </select>
                    </div>
                    <div class="location-detail">
                        <div>Địa chỉ chi tiết</div>
                        <div class="address-add-input">
                            <input v-model="detail" type="text" class="form-control"
                                placeholder="Số nhà,tên đường,..." />
                        </div>
                    </div>
                    <div class="form-check">
                        <input v-model="addressInfo.isDefault" class="form-check-input" type="checkbox" value=""
                            id="check-default" />
                        <label class="form-check-label" for="check-default">
                            Đặt làm mặc định
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Hủy
                    </button>
                    <button @click.prevent="updateAddress" data-bs-dismiss="modal" type="button"
                        class="btn btn-primary">Thêm</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Swal from 'sweetalert2';
import { ref, onBeforeMount,reactive, watch } from 'vue'
import {
    getDistricts,
    getProvinces,
    getWards,
} from "@/data.function/vnapis.get";
import { authStore } from "@/stores/user.store";
import { storeToRefs } from "pinia";
const auth = authStore();
const { user } = storeToRefs(auth);
const addressInfo = reactive({
  id:"",
  tenDiaChi: "",
  detail:"",
  diaChi: "",
  isDefault: false
})
const props = defineProps({
    address: {
        type: Object,
        required: true
    },
    idModal: {
      type: String,
      required: true
    }
})
onBeforeMount(async() => {
  getData(props.address);
  await loadCity();
  city.district = await getDistricts(props.address.detail.provinceId);
  city.ward = await getWards(props.address.detail.districtId);
    detail.value = getLandmarks(props.address.diaChi)
    addressName.provinceName = city.province.find(province => province.province_id == props.address.detail.provinceId)?.province_name;
})
const getLandmarks = (address)=>{
  const addressParts = address.split(',');
  return addressParts.slice(0, -3).join(', ').trim();
}
const action = reactive({
  showMessage: false,
  success: false,
  message: "",
  showUpdate: false
})
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
  () => addressInfo.detail.provinceId,
  (value) => {
    console.log(value);
    if(value !=""){
    getDistricts(value).then((response) => {
      city.district = response;
    });
    addressName.provinceName = city.province.find(province => province.province_id == value)?.province_name;
  }
  }
);
watch(
  () => addressInfo.detail.districtId,
  (value) => {
    if(value!=""){
    getWards(value).then((response) => {
      city.ward = response;
    });
    addressName.districtName = city.district.find(district => district.district_id == value)?.district_name;
  }
}
);
watch(() => addressInfo.detail.wardId,
  (value) => {
    if(value!=""){
    addressName.wardName = city.ward.find(ward => ward.ward_id == value)?.ward_name;
    }
  })
const updateAddress = () => {
  if(detail.value=="") {
    alert("Địa chỉ không thể để trống")
    return;
  }
    addressInfo.diaChi =detail.value + ", " + addressName.wardName + ", " + addressName.districtName + ", " + addressName.provinceName;
  let duplicateAddress = user.value.address.find(item => item.diaChi == addressInfo.diaChi.trim())
  if (duplicateAddress) {
    Swal.fire({
        title: 'Thông báo',
        text: 'Địa chỉ của bạn đã tồn tại ! Thử lại',
        icon:'info',
        confirmButtonText: 'Đã hiểu'  
      })
    return;
  }
  auth.updateAdress(addressInfo).then(result => {
    if (result) {
      Swal.fire({
        title: 'Thành công!',
        text: 'Cập nhật địa chỉ thành công',
        icon:'success',
        confirmButtonText: 'Đồng ý'  
      })
    }
    else {
      Swal.fire({
        title: 'Thất bại!',
        text: 'Không thể thực hiện cập nhật',
        icon:'error',
        confirmButtonText: 'Đồng ý'  
      })
    }
  })
}
const detail = ref("");
const getData = (data) =>{
  addressInfo.id = data.id;
  addressInfo.tenDiaChi = data.tenDiaChi;
  addressInfo.detail = data.detail;
  addressInfo.diaChi = data.diaChi;
  addressInfo.isDefault = data.isDefault;
}
</script>
<style scoped>

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
</style>