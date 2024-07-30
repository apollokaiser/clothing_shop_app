<template>
    <div class="location-container p-1 d-flex justify-content-between align-items-center">

        <span class="location-icon"><i class="fa fa-map-marker" aria-hidden="true"></i></span>
        <div @click="showOption=!showOption" class="d-flex flex-column justify-content-center align-items-center">
            <span class="fst-italic">Chọn nơi nhận hàng <i class="fa fa-chevron-down ms-1"
                    aria-hidden="true"></i></span>
            <span>{{ addressDisplay }}</span>
        </div>
        <Transition name="fade-down">
            <div v-if="showOption" class="choose-location-container">
                <i @click="showOption=!showOption" class="fa fa-times close" aria-hidden="true"></i>
                <span class="fst-italic ps-4">Chọn nơi nhận hàng</span>
                <div class="choose-location-radio">
                    <div class="radio-location">
                        <form>
                            <label>
                                <input v-model="myAddress.location" type="radio" name="radio" value="1">
                                <span>Cửa hàng</span>
                            </label>
                            <label>
                                <input v-model="myAddress.location" type="radio" name="radio" value="2">
                                <span>Địa chỉ khác</span>
                            </label>
                        </form>
                    </div>
                </div>
                <div class="choose-order-address" v-if="myAddress.location == 2">Chọn địa chỉ bên dưới: </div>
                <div v-if="myAddress.location == 2" class="order-location-contaner">
                    <select v-model="myAddress.province" name="" id="">
                        <option value="0">Chọn thành phố</option>
                        <option v-for="item in city.province" :value="item.province_id">{{ item.province_name }}
                        </option>

                    </select>
                    <select v-model="myAddress.district" name="" id="">
                        <option checked value="0">Chọn quận, huyện</option>
                        <option v-if="myAddress.province != ''" v-for="item in city.district" :value="item.district_id">
                            {{
                                item.district_name }}</option>
                    </select>
                    <select v-model="myAddress.ward" name="" id="">
                        <option checked value="0">Chọn xã, phường, thị trấn</option>
                        <option v-if="myAddress.province != '' && myAddress.district != ''" v-for="item in city.ward" :key="item.district_id"
                            :value="item.ward_id">{{ item.ward_name }}</option>
                    </select>
                </div>
            </div>
        </Transition>

    </div>
</template>
<style scoped>
.fade-down-enter-active, 
   .fade-down-leave-active {
    transition: all 0.3s;
}

.fade-down-enter-from, 
   .fade-down-leave-to {
    opacity: 0;
}
.location-container {
    border: 1px solid rgb(243, 243, 243);
    cursor: pointer;
}

.location-container {
    position: relative;
}

.location-container .choose-location-container {
    position: absolute;
    width: auto;
    min-width: 120%;
    max-width: 500%;
    top: 120%;
    left: 0;
    border: 1px solid #eee;
    border-radius: 10px;
    background-color: white;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    z-index: 100;
}

.location-container .choose-location-container .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
    font-size: 25px;
}

.location-container .choose-location-radio {
    display: flex;
    flex-direction: column;
    padding: 10px;
    justify-content: flex-start;
    align-items: flex-start;
}

.choose-location-radio input[type="radio"] {
    padding: 10px;
    width: 20px;
    margin-right: 10px;
}

.choose-order-address {
    transition: all 0.5s ease-in-out;
}

.location-container .order-location-contaner {
    display: flex;
    padding: 10px;
    justify-content: flex-start;
    align-items: flex-start;
}

.order-location-contaner select {
    padding: 5px;
    margin-right: 20px;
    outline: none;
    background-image: linear-gradient(to left, #fdd2ee, #f9def7, #f8eafc, #f9f5ff, #ffffff);
    border-radius: 5px;
    color: #f76161;
    transition: all 0.3s ease-in-out;
}

.order-location-contaner select:focus {
    border: 1px solid#ee58a6;
    box-shadow: 0px 0px 10px 0px rgba(247, 65, 219, 0.7);
}

.radio-location form {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
}

.radio-location label {
    display: flex;
    cursor: pointer;
    font-weight: 500;
    position: relative;
    overflow: hidden;
    margin-bottom: 0.375em;
}

.radio-location label input {
    position: absolute;
    left: -9999px;
}

.radio-location label input:checked+span {
    background-color: #ee58a6;
    /* #414181 */
    color: white;
}

.radio-location label input:checked+span:before {
    box-shadow: inset 0 0 0 0.4375em rgb(144, 0, 160);
    /* #00005c */
}

.radio-location label span {
    display: flex;
    align-items: center;
    padding: 0.375em 0.75em 0.375em 0.375em;
    border-radius: 99em;
    transition: 0.25s ease;
    color: #414181;
}

.radio-location label span:hover {
    background-color: #d6d6e5;
}

.radio-location label span:before {
    display: flex;
    flex-shrink: 0;
    content: "";
    background-color: #fff;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    margin-right: 0.375em;
    transition: 0.25s ease;
    box-shadow: inset 0 0 0 0.125em #00005c;
}
</style>
<script setup>
import { reactive, onBeforeMount, watch, computed, defineModel, ref } from 'vue';
import { getProvinces, getDistricts, getWards } from '@/data.function/vnapis.get';
const showOption = ref(false);
const myAddress = reactive({
    province: 0,
    district: 0,
    ward: 0,
    location: "1",
})
const city = reactive({
    province: [],
    district: [],
    ward: [],
})
const myAddressName = reactive({
    province: '',
    district: '',
    ward: '',
    location: "1",
})
onBeforeMount(() => {
    getProvinces().then(res => {
        city.province = res;
    })
})
const addressDisplay = computed(() => {
    if (myAddress.location == 1) return "Cửa hàng";
    if (myAddress.location == 2 && myAddress.province == 0) return "Cửa hàng";
    if (myAddress.location == 2 && myAddress.province != 0)
        return myAddressName.province;
    return "Cửa hàng";
})
watch(() => myAddress.location, (value) => {
    console.log("my address location : " + value);
    if (value == "1") {
        console.log("log here ...");
    }
})
watch(() => myAddress.province, (value) => {
    getDistricts(value).then(res => {
        city.district = res;
    })
    myAddressName.province = city.province.find(item => item.province_id == value).province_name;
})

watch(() => myAddress.district, (value) => {
    getWards(value).then(res => {
        city.ward = res;
    })
    myAddressName.district = city.district.find(item => item.district_id == value).district_name;
})

watch(() => myAddress.ward, (value) => {
    myAddressName.ward = city.ward.find(item => item.ward_id == value).ward_name;
})
</script>