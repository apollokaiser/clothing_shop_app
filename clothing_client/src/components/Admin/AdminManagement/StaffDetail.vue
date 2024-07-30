<template>
    <div>
        <h1 class="staff-info-header">
            <span @click="back">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0397d6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H6M12 5l-7 7 7 7"/></svg>
            </span>
            <span>Thông tin nhân viên</span>
        </h1>
        <div class="staff-info-content">
            <div class="details col-sm-5">
                <div class="detail-wrapper">
                    <div class="detail-header">Thông tin tổng quan</div>
                    <div class="detail-body">
                        <div class="row">
                            <div class="col-sm-5">ID:</div>
                            <div class="col-sm-7 detail-content admin-id">{{ staffDetail.id }}</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-5">Tên nhân viên:</div>
                            <div class="col-sm-7 detail-content">{{ staffDetail.tenNguoiDung }}</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-5">Email nội bộ:</div>
                            <div class="col-sm-7 detail-content">{{ staffDetail.email }}</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-5">Email:</div>
                            <div class="col-sm-7 detail-content">{{ staffDetail.adminEmail }}</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-5">Vai trò:</div>
                            <div class="col-sm-7 detail-content">{{ getRole(staffDetail.role) }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="action-detail col-sm-6">
                <div class="action-detail-wrapper">
                    <div class="action-detail-header">Thông tin hoạt động</div>
                    <div class="action-detail-body">
                        <div class="row">
                            <div class="col-sm-6">Người tạo:</div>
                            <div class="col-sm-6 detail-content" :class="{'text-warning fst-italic': !staffDetail.createdBy}">{{ staffDetail.createdBy || "Không có" }}</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6">Ngày tạo:</div>
                            <div class="col-sm-6" :class="{'text-warning fst-italic': !staffDetail.createAt}">{{ new Date(staffDetail.createAt*1000).toLocaleString()  || "Không xác định" }}</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6">Trạng thái</div>
                            <div class="col-sm-6">{{ staffDetail.enabled ? "Còn hoạt động" : "Không hoạt động" }}</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6">Đăng nhập lần cuối</div>
                            <div class="col-sm-6">{{timeDifference(staffDetail.lastLogin).status}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.staff-info-header {
    width: 100%; 
    color: #0397d6;
    padding: 10px 20px;
    background: #f5f5f5;
    border-radius: 3px;
    margin-top: 20px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.staff-info-header svg {
    cursor: pointer;
    transition: 0.2s linear;
}

.staff-info-header svg:hover {
    transform: translateY(-5px);
    stroke: #10c469;
}

.staff-info-content {
    padding: 20px 20px;
    width: 100%;
    display: flex;
    justify-content: center;


}

.staff-info-content .details,
.staff-info-content .action-detail {
    color: #fff;
    font-size: 18px;
    padding: 10px;
}

.details .detail-wrapper .detail-header,
.action-detail-wrapper .action-detail-header {
    padding: 10px;
    border-radius: 3px;
    background: #435c70;
    color: #fff;
    text-align: center;
}

.action-detail-body,
.detail-body {
    font-size: 15px;
    overflow: hidden;
}

.action-detail-body>div,
.detail-body>div {
    padding: 7px 0;
}

.detail-content {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

}
.admin-id {
    position: relative;
}
.admin-id::before{
    width: 100%;
    height: 100%;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background: #f5f5f5;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: 0.2s linear;
}
</style>
<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router'
import { getStaffDetail } from '@/data.function/getData'
import  {getRole} from "@/utils/util.function"
import {timeDifference} from "@/utils/util.function"
const router = useRouter()
const staffDetail = ref("");
function back() {
    router.back();
}
const props = defineProps({
    aid:{
        type: String,
        required: true
    }
})
onBeforeMount(async() => {
    const response = await getStaffDetail(props.aid);
    if(response) staffDetail.value = response;
})
</script>