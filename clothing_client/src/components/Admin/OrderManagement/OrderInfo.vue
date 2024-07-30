<script setup>
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import { getOrderDetail } from '@/data.function/getData';
import { completedOrder, addDeposit as insertDeposit } from '@/data.function/postData';
import { useRouter } from 'vue-router';

import Swal from 'sweetalert2';
import convertToVND from '@/utils/convertVND';
const router = useRouter()
const props = defineProps({
    id: {
        type: String,
        required: true
    }
})
const deposit = reactive({
    soTien: 0,
    ngayThu: Date.now() / 1000,
    maDonThue: props.id,
    trangThai: "SUCCESS",
    payment: "DIRECT"
})
const orderDetail = ref({});
onBeforeMount(() => {
    getOrderDetail(props.id).then(res => {
        console.log(res);
        if (!res) {
            (async () => {
                const { value: error } = await Swal.fire({
                    title: 'Lỗi',
                    text: 'Không thể tìm thấy đơn đặt dịch vụ của bạn !',
                    icon: 'error',
                    confirmButtonText: 'Đã hiểu'
                })
                if (error) {
                    router.back();
                }
            })()
        } else {
            orderDetail.value = res;
        }
    })
})
const depositValue = computed(() => {
    return convertToVND(Number(deposit.soTien));
})
watch(() => deposit.soTien, value => {
    if (deposit.soTien > orderDetail.value.tongThue / 2) {
        deposit.soTien = orderDetail.value.tongThue / 2;
        Swal.fire({
            title: 'Lưu ý',
            text: 'Đã đạt mức yêu cầu!',
            icon: 'info',
            confirmButtonText: 'Đã hiểu'
        })
    }
})
const addDeposit = () => {
    if (deposit.soTien == "") {
        Swal.fire({
            title: 'Lưu ý',
            text: 'Vui lòng nhập số tiền đặt cọc!',
            icon: 'info',
            confirmButtonText: 'Đã hiểu'
        })
        return;
    } else {
        insertDeposit(deposit).then(res => {
            if (!res) {
                Swal.fire({
                    title: 'Thông báo',
                    text: 'Đặt cọc thất bại !',
                    icon: 'info',
                    confirmButtonText: 'Đã hiểu'
                })
            } else {
                (async () => {
                    const { value: success } = await Swal.fire({
                        title: 'Thông báo',
                        text: 'Đặt cọc thành công!',
                        icon: 'success',
                        confirmButtonText: 'Đã hiểu'
                    })
                    if (success) {
                        router.back();
                    }
                })()

            }
        })
    }
}
const overDay = computed(()=>{
    let diff = (Date.now() - new Date(orderDetail.value.ngayNhan * 1000))/(1000 * 60 * 60 * 24);
    return diff.toFixed(0);
})
const phuThu = computed(()=>{
    return convertToVND(overDay.value * 0.3 * orderDetail.value.tongThue);
})
const total = computed(()=>{
    return convertToVND(orderDetail.value.tongThue - orderDetail.value.datCoc.soTien + (overDay.value * 0.3 * orderDetail.value.tongThue));
})
const exportOrder = ()=>{
    console.log(orderDetail.value.maDonThue);
    let phieuHoaTra = {
        id:props.id,
        phuThu:(overDay.value * 0.3 * orderDetail.value.tongThue).toFixed(0),
        quaHan:overDay.value,
        tongTien: (orderDetail.value.tongThue - orderDetail.value.datCoc.soTien + (overDay.value * 0.3 * orderDetail.value.tongThue)).toFixed(0),
        trangThai:"SUCCESS"
    }
    completedOrder(phieuHoaTra).then(res=>{
        if(!res){
            Swal.fire({
                title: 'Thông báo',
                text: 'Hoàn thành đơn thuê thất bại!',
                icon: 'info',
                confirmButtonText: 'Đã hiểu'
            })
        }else{
            Swal.fire({
                title: 'Thông báo',
                text: 'Hoàn thành đơn thuê thành công!',
                icon:'success',
                confirmButtonText: 'Đã hiểu'
            })
        }
    })
}
</script>
<template>
    <section class="h-100">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-lg-10 col-xl-8">
                    <div class="card" style="border-radius: 10px;">
                        <div class="card-header px-4 py-5">
                            <h5 class="text-muted mb-0">Đơn thuê khách hàng <span style="color: #a8729a;"><i>{{
                                orderDetail.tenNguoiNhan }}</i></span></h5>
                        </div>
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-start flex-column mb-4">
                                <p class="lead fw-normal mb-1" style="color: #a8729a;">Thông tin người nhận </p>
                                <p class="small text-muted mb-1">Tên người nhận : <b>{{ orderDetail.tenNguoiNhan }}</b>
                                </p>
                                <p class="small text-muted mb-1">Số điện thoại : <b>{{ orderDetail.sdtNguoiNhan }}</b>
                                </p>
                                <p class="small text-muted mb-1">Địa chỉ nhận : <b>{{ orderDetail.diaChiNguoiNhan }}</b>
                                </p>
                                <p class="small text-muted mb-1">
                                    Trạng thái :
                                    <b :class="{
                                        'text-success': orderDetail.trangThai?.maTrangThai == 2 || orderDetail.trangThai?.maTrangThai == 3,
                                        'text-warning': orderDetail.trangThai?.maTrangThai == 1,
                                        'text-danger': orderDetail.trangThai?.maTrangThai != 1 && orderDetail.trangThai?.maTrangThai != 2
                                    }">
                                        {{ orderDetail.trangThai.trangThai }}
                                    </b>
                                </p>
                                <p v-if="orderDetail.datCoc" class="small text-muted mb-1">
                                    Số tiền cọc :
                                    <b>{{ convertToVND(orderDetail.datCoc?.soTien) }} </b>
                                </p>
                                <p v-if="orderDetail.datCoc" class="small text-muted mb-1">
                                    Ngày đặt cọc :
                                    <b>{{new Date(orderDetail.datCoc?.ngayCoc*1000).toLocaleString() }} </b>
                                </p>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <p class="lead fw-normal mb-0" style="color: #a8729a;">Thông tin trang phục </p>
                                <p class="small text-muted mb-0">Mã đơn : <b>{{ props.id.toUpperCase() }}</b> </p>
                            </div>
                            <div v-for="(item, index) in orderDetail.chiTiet" :key="index"
                                class="card shadow-0 border mb-4">
                                <div class="card-body">
                                    <div class="row">
                                        <div
                                            class="col-md-6 text-center d-flex justify-content-start align-items-center">
                                            <p class="text-muted mb-0">{{ item.trangPhuc.tenTrangPhuc }}</p>
                                        </div>
                                        <div
                                            class="col-md-2 text-center d-flex justify-content-center align-items-center">
                                            <p class="text-muted mb-0 small">Kích cỡ: {{ item.maKichThuoc || 'Không' }}
                                            </p>
                                        </div>
                                        <div
                                            class="col-md-4 text-center d-flex flex-column justify-content-center align-items-center">
                                            <p class="text-muted mb-0 small">{{ convertToVND(item.tongTien) }}</p>
                                            <p class="text-muted mb-0 small">x {{ item.soLuong }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between pt-2">
                                <p class="fw-bold mb-0">Chi tiết </p>
                                <p class="text-muted mb-0"><span class="fw-bold me-4">Tạm tính</span>{{
                                    convertToVND(orderDetail.tamTinh) }}</p>
                            </div>

                            <div class="d-flex justify-content-between pt-2">
                                <p class="text-muted mb-0">Mã ưu đãi : {{ orderDetail.phieuKhuyenMai || "Không có" }}
                                </p>
                                <p class="text-muted mb-0"><span class="fw-bold me-4">Tổng ưu đãi</span>{{
                                    convertToVND(orderDetail.tongUuDai) }}</p>
                            </div>
                            <div class="d-flex justify-content-between pt-2">
                                <p class="text-muted mb-0"></p>
                                <p class="text-muted mb-0"><button v-if="orderDetail.trangThai.maTrangThai == 1"
                                        data-bs-toggle="modal" data-bs-target="#deposit" class="deposit-btn">Đặt
                                        cọc</button></p>
                            </div>
                            <div class="d-flex justify-content-between pt-2">
                                <p class="text-muted mb-0"></p>
                                <p class="text-muted mb-0"><button v-if="orderDetail.trangThai.maTrangThai == 3"
                                        data-bs-toggle="modal" data-bs-target="#exportOrder" class="deposit-btn">Xuất phiếu</button></p>
                            </div>
                        </div>
                        <div class="card-footer border-0 px-4 py-5"
                            style="background-color: #a8729a; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                            <h5 class="d-flex align-items-center justify-content-end text-white text-uppercase mb-0">
                                Tổng thuê: <span class="h2 mb-0 ms-2">{{ convertToVND(orderDetail.tongThue) }}</span>
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="deposit" tabindex="-1" aria-labelledby="depositLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header border-bottom-0">
                        <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn-close"
                            data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-start p-4">
                        <h5 class="modal-title text-uppercase mb-5" id="depositLabel">{{ orderDetail.tenNguoiNhan }}
                        </h5>
                        <h4 class="mb-5">Đặt cọc</h4>
                        <p class="mb-0">Thông tin đặt cọc khách hàng</p>
                        <hr class="mt-2 mb-4"
                            style="height: 0; background-color: transparent; opacity: .75; border-top: 2px dashed #9e9e9e;">

                        <div class="d-flex justify-content-between mb-2">
                            <p class="fw-bold mb-0">Số tiền cọc</p>
                            <p class="text-muted mb-0">
                                <input v-model="deposit.soTien" class="form-control" type="text" name="" id="">
                            </p>
                        </div>

                        <div class="d-flex justify-content-between mb-2">
                            <p class="small mb-0">Phương thức</p>
                            <p class="small mb-0">
                                <select v-model="deposit.payment" class="form-select" name="" id="">
                                    <option value="DIRECT">Tiền mặt</option>
                                    <option value="ONLINE">Thanh toán trực tuyến</option>
                                </select>
                            </p>
                        </div>

                        <div class="d-flex justify-content-between pb-1">
                            <p class="small">Hạn mức cọc</p>
                            <p class="small">{{ convertToVND(orderDetail.tongThue / 2) }} (50%)</p>
                        </div>
                        <div class="d-flex justify-content-between">
                            <p class="fw-bold">Cọc sẵn</p>
                            <p class="fw-bold">{{ depositValue }}</p>
                        </div>
                        
                    </div>
                    <div class="modal-footer d-flex justify-content-center border-top-0 py-4">
                        <button @click.prevent="addDeposit" type="button" data-bs-dismiss="modal"
                            class="btn btn-primary btn-lg mb-1" style="background-color: #35558a; color: #fff">
                            Hoàn tất
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="orderDetail.datCoc" class="modal fade" id="exportOrder" tabindex="-1" aria-labelledby="exportOrderLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header border-bottom-0">
                        <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn-close"
                            data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-start p-4">
                        <h5 class="modal-title text-uppercase mb-5" id="exportOrderLabel">{{ orderDetail.tenNguoiNhan }}
                        </h5>
                        <h4 class="mb-5">Xuất phiếu</h4>
                        <p class="mb-0">Thông tin đặt cọc khách hàng</p>
                        <hr class="mt-2 mb-4"
                            style="height: 0; background-color: transparent; opacity: .75; border-top: 2px dashed #9e9e9e;">

                        <div class="d-flex justify-content-between mb-2">
                            <p class="fw-bold mb-0">Số tiền</p>
                            <p class="text-muted mb-0">
                                <div>{{ convertToVND(orderDetail.datCoc?.soTien) }}</div>
                            </p>
                        </div>

                        <div class="d-flex justify-content-between mb-2">
                            <p class="small mb-0">Tổng thuê</p>
                            <p class="small mb-0">{{ convertToVND(orderDetail.tongThue) }} </p>
                        </div>

                        <div class="d-flex justify-content-between pb-1">
                            <p class="small">Ngày hoàn trả</p>
                            <p class="small">{{ new Date().toLocaleString() }}</p>
                        </div>
                        <div class="d-flex justify-content-between">
                            <p class="fw-bold">Quá hạn</p>
                            <p class="fw-bold">{{overDay}} (ngày)</p>
                        </div>
                        <div class="d-flex justify-content-between">
                            <p class="fw-bold">Phụ thu</p>
                            <p class="fw-bold">{{ phuThu }}</p>
                        </div>
                        <div class="d-flex justify-content-between">
                            <p class="fw-bold">Số tiền phải trả</p>
                            <p class="fw-bold">{{ total }}</p>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center border-top-0 py-4">
                        <button @click.prevent="exportOrder" type="button" data-bs-dismiss="modal"
                            class="btn btn-primary btn-lg mb-1" style="background-color: #35558a; color: #fff">
                            Hoàn tất
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<style scoped>
.deposit-btn {
    background-color: #f6f3ff;
    color: #a8729a;
    border-radius: 5px;
    padding: 10px 30px;
    cursor: pointer;
    border: 1px solid #a8729a;
    transition: background-color 0.3s ease;
}
</style>