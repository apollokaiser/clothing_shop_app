<script setup>
import { storeToRefs } from 'pinia';
import { computed, onBeforeMount, reactive, ref, watch } from 'vue'
import Link from './Link.vue';
import { useOrderStore } from '@/stores/order.store';
import { authStore } from '@/stores/user.store';
import convertToVND from '@/utils/convertVND';
import { isValidDate } from '@/utils/util.function';
import { ACCEPT_PROVINCES } from '@/utils/constant';
import { getProvinces, getDistricts, getWards } from '@/data.function/vnapis.get';
const donThue = useOrderStore()
const auth = authStore()
const { order, address } = storeToRefs(donThue);
const { user, isLoggedIn } = storeToRefs(auth);
const city = reactive({
  province:[],
  district:[],
  ward:[],
})
const orderAddress = reactive({
  address:"",
  province: "",
  district: "",
  ward: "",
})
const chooseAddress = ref("");
onBeforeMount(() => {
  if (isLoggedIn.value) {
    let defaultAddress = user.value.address.find(item => item.isDefault)
    if (user.value.address.length > 0 && defaultAddress) {
      order.value.diaChiNguoiNhan = defaultAddress.diaChi;
      chooseAddress.value = defaultAddress.id;
      order.value.tenNguoiNhan = user.value.name;
      order.value.sdtNguoiNhan = user.value.phone || "";
    }
    chooseAddress.value = 0;
  }
  else if (address.value != "") {
    order.value.diaChiNguoiNhan = address.value;
  }
  getProvinces().then(res => {
    console.log(res);
    city.province = res.filter(item => ACCEPT_PROVINCES.includes(item.province_id));
  })
})
const price = computed(()=>{
  return convertToVND(order.value.tamTinh || 0);
})
const discount = computed(()=>{
  return convertToVND(order.value.tongUuDai || 0);
}) 
const total = computed(()=>{
  return convertToVND(order.value.tamTinh - order.value.tongUuDai);
})

watch(chooseAddress, value => {
  if (value == "0") order.value.diaChiNguoiNhan = " "
  else order.value.diaChiNguoiNhan = user.value.address?.find(item => item.id == value).diaChi;
})
watch(() => order.value.diaChiNguoiNhan, value => {
  if (value == "") {
    chooseAddress.value = "0";

  }
})
watch(order.value.ngayNhan, value => {
  if (isValidDate(value)) {
    alert("Ngày thuê phải dự kiến ít nhất 2 ngày và không quá 1 tuần !");
    order.value.ngayNhan = new Date();
  }
})
watch(()=> orderAddress.province, value =>{
  getDistricts(value).then(res => {
    city.district = res;
    orderAddress.district = city.district[0]?.district_id || "";
  })
})

watch(()=> orderAddress.district, value =>{
  getWards(value).then(res => {
    city.ward = res;
    orderAddress.ward = city.ward[0]?.ward_id || "";
  })
})
watch(()=> orderAddress.address, value =>{
  if(value.trim() != ""){
    let province = city.province.find(item=> item.province_id == orderAddress.province).province_name
    let district = city.district.find(item=> item.district_id == orderAddress.district).district_name
    let ward = city.ward.find(item=> item.ward_id == orderAddress.ward).ward_name
    order.value.diaChiNguoiNhan = value + ", " + ward + ", " + district + ", " + province
  }
})
</script>
<template>
  <!--order-->
  <div class="modal fade" id="order" tabindex="-1" aria-labelledby="orderLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-body">
          <section class="order-container">
            <header>Thuê trang phục</header>
            <form class="form">
              <div class="input-box">
                <label>Tên người nhận</label>
                <input v-model="order.tenNguoiNhan" placeholder="Người nhận ..." type="text">
              </div>
              <div class="column">
                <div class="input-box">
                  <label>Số điện thoại</label>
                  <input v-model="order.sdtNguoiNhan" required="" placeholder="03*****30" type="telephone">
                </div>
                <div class="input-box">
                  <label>Ngày nhận</label>
                  <input v-model="order.ngayNhan" required="" placeholder="Ngày muốn nhận ..." type="date">
                </div>
              </div>
              <div class="input-box address">
                <div v-if="user.address.length > 0" class="select-box">
                  <select v-model="chooseAddress">
                    <option hidden="">Chọn địa chỉ của bạn</option>
                    <option :checked="item.isDefault" v-for="item in user.address" :key="item.id" :value="item.id">{{
                      item.tenDiaChi }}</option>
                    <option value="0">Khác ...</option>
                  </select>
                </div>
                <label>Địa chỉ người nhận</label>
                <div v-if="chooseAddress != 0" class="my-address">{{ order.diaChiNguoiNhan }}</div>
                <div v-if="chooseAddress == 0">
                <div class="select-box">
                    <select v-model="orderAddress.province">
                      <option hidden="">Tỉnh, thành phố</option>
                      <option v-for="item in city.province" :key="item.province_id" :value="item.province_id">{{ item.province_name }}</option>
                    </select>
                  </div>
                <div class="column">
                  
                  <div class="select-box">
                    <select v-model="orderAddress.district">
                      <option hidden="">Quận, huyện</option>
                      <option v-for="item in city.district" :key="item.district_id" :value="item.district_id">{{ item.district_name }}</option>
                    </select>
                  </div>
                  <div class="select-box">
                    <select v-model="orderAddress.ward">
                      <option hidden="">Xã, phường</option>
                      <option v-for="item in city.ward" :key="item.ward_id" :value="item.ward_id">{{ item.ward_name }}</option>
                    </select>
                  </div>
                </div>
              </div>
                <input v-if="chooseAddress == 0" v-model="orderAddress.address" required="" placeholder="Số nhà, tên đường ..." type="text">
              </div>
              <div class="order-total">
                <div>
                  <span>Tạm tính</span>
                  <span>{{ price }}</span>
                </div>
                <div>
                  <span>Tổng ưu đãi</span>
                  <span>{{discount}}</span>
                </div>
                <div>
                  <span>Thành tiền </span>
                  <span>{{total}}</span>
                </div>
              </div>
              <Link :to="{name:'payment', uid:'1', slug:'thanh-toan-thue-trang-phuc'}">
              <button data-bs-dismiss="modal">Thuê ngay</button>
              </Link>
              <button class="close" data-bs-dismiss="modal">Xem lại đã !</button>
            </form>
          </section>
        </div>
      </div>
    </div>
  </div>
  <!--end order-->
</template>

<style scoped>
.order-container {
  position: relative;
  max-width: 500px;
  width: 100%;
  background: #FCEDDA;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.order-container header {
  font-size: 1.2rem;
  color: #000;
  font-weight: 600;
  text-align: center;
}

.order-container .form {
  margin-top: 15px;
}

.form .input-box {
  width: 100%;
  margin-top: 10px;
}

.input-box label {
  color: #000;
}

.form :where(.input-box input, .select-box) {
  position: relative;
  height: 35px;
  width: 100%;
  outline: none;
  font-size: 1rem;
  color: #808080;
  margin-top: 5px;
  border: 1px solid #EE4E34;
  border-radius: 6px;
  padding: 0 15px;
  background: #FCEDDA;
}

.input-box input:focus {
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}

.form .column {
  display: flex;
  column-gap: 15px;
}

.form .gender-box {
  margin-top: 10px;
}

.form :where(.gender-option, .gender) {
  display: flex;
  align-items: center;
  column-gap: 50px;
  flex-wrap: wrap;
}

.form .gender {
  column-gap: 5px;
}

.gender input {
  accent-color: #EE4E34;
}

.form :where(.gender input, .gender label) {
  cursor: pointer;
}

.gender label {
  color: #000;
}

.address :where(input, .select-box) {
  margin-top: 10px;
}

.select-box select {
  height: 100%;
  width: 100%;
  outline: none;
  border: none;
  color: #808080;
  font-size: 1rem;
  background: #FCEDDA;
}

.form button {
  height: 40px;
  width: 100%;
  color: #000;
  font-size: 1rem;
  font-weight: 400;
  margin-top: 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #EE4E34;
}

.form button:hover {
  background: #EE3E34;
}

.my-address {
  padding: 5px;
  background-color: #ccc;
  border-radius: 5px;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: left;
  white-space: nowrap;

}

.order-total {
  width: 100%;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

}

.order-total>div {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
button.close {
  background-color: #808080;
}
button.close:hover {
  background-color: #5f5d5d;
}
</style>