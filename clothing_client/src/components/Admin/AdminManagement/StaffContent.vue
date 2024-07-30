<script setup>
import Swal from 'sweetalert2';
import { onBeforeMount, ref } from 'vue';
import { getStaffs } from '@/data.function/getData';
import { removeStaff, lockStaff,unclockStaff, changeRole as updateRole } from '@/data.function/postData';
import { timeDifference } from '@/utils/util.function';
import Link from '@/components/Link.vue';
import { authStore } from '@/stores/user.store';
import { storeToRefs } from 'pinia';
import { ROLES, UPDATE_ROLE } from '@/utils/constant';
const auth = authStore();
const {user} = storeToRefs(auth);
const staffList = ref([])
onBeforeMount(()=>{
    getStaffs().then(response=>{
        if(response) {
        response.forEach(element => {
            let time = timeDifference(element.lastLogin);
            element.status =time.status;
            element.code = time.code;
        });
        staffList.value = response;
    }
    })
}) 
const activationClass =(code)=>{
    return code === 1? 'text-success' : code === 0? 'text-danger' : 'text-secondary';
}
const deleteStaff =(id)=>{
    (async()=>{
        const {value:result} = await Swal.fire({
            title: 'Xác nhận',
            text: "Bạn có chắc chắn muốn xóa nhân viên này?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        })
        if (result) {
            const response = await removeStaff(id);
            if(!response){
                Swal.fire("Lỗi xóa không thể thực hiện", "Cảnh báo", "error")
            }
            if(response.status == 200) {
                const index = staffList.value.findIndex(staff=>staff.id == id);
                staffList.value.splice(index, 1);
                Swal.fire("Thành công", "Xóa nhân viên thành công", "success")
            }
        }
    })()
}
const lockHandle = async (id, enabled=true)=>{
    let response = null;
    if(enabled){
    response = await lockStaff(id);
    } else {
       response = await unclockStaff(id);
    }
    if(!response) {
            Swal.fire({
                title: 'Thông báo',
                text: "Đã xãy ra lỗi bất ngờ ! Thử lại",
                icon:'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Đã hiểu'
            })
    } if(response.status ===200) {
            const index = staffList.value.findIndex(staff=>staff.id == id);
            staffList.value[index].enabled =!staffList.value[index].enabled;
            Swal.fire("Thành công", "Đã cập nhật trạng thái nhân viên", "success")
        }
}
const changeRole = async(id) =>{
    (async()=>{
 const {value:submit} = await Swal.fire({
    title: 'Thay đổi quyền hạn',
    input: 'select',
    inputOptions: UPDATE_ROLE
  ,
    showCancelButton: true,
    confirmButtonText: 'Thay đổi',
    cancelButtonText: 'Hủy',
    showLoaderOnConfirm: true,
  })
  if(submit){
   const response = await updateRole(id, submit);
   if(!response || response.status !==200) {
     Swal.fire({
       title: 'Thông báo',
       text: 'Cập nhật quyền hạn không thành công',
       icon:'info',
       confirmButtonText: 'OK'
     })
   } else if(response.status == 200) {
    const index = staffList.value.findIndex(staff=>staff.id == id);
    staffList.value[index].role = submit;
     Swal.fire({
       title: 'Thông báo',
       text: 'Cập nhật trạng thái thành công',
       icon:'success',
       confirmButtonText: 'OK'
     })
   }
  }
 })()
}
</script>
<template>
          <div class="table-responsive">
        <div class="table-wrapper">
            <div class="table-title">
                <div class="row">
                    <div class="col-sm-5">
                        <h2>Quản lý <b>nhân viên</b></h2>
                    </div>
                    <div class="col-sm-7">
                       <Link :to="{name:'add-staff'}"><a class="btn btn-secondary"><i class="material-icons">&#xE147;</i> <span>Thêm mới</span></a></Link> 
                        <a href="#" class="btn btn-secondary"><i class="material-icons">&#xE24D;</i> <span>Export to Excel</span></a>						
                    </div>
                </div>
            </div>
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Họ tên</th>						
                        <th>Hoạt động</th>
                        <th>Vai trò</th>
                        <th>SDT</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="staff-item" v-for="(item,index) in staffList" :key="index" :class="{'inactive':!item.enabled}" @dblclick="lockHandle(item.id, item.enabled)">
                        <td>{{ index }}</td>
                        <td><Link :to="{name:'staff-info', params:{aid:item.id}}">{{ item.tenNguoiDung || 'Không có' }}</Link></td>
                        <td><span class="status" :class="activationClass(item.code)">&bull;</span>{{item.status }}
                        </td>                        
                        <td class="role">{{ item.role }}
                         <svg @click="changeRole(item.id)" class="ms-2 mb-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 20" fill="none" stroke="#bd10e0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
                        </td>
                        <td>{{ item.sdt }}</td>
                        <td>
                            <Link :to="{name:'update-staff', params:{id:item.id}}"><a class="settings" title="Settings" data-toggle="tooltip"><i class="material-icons">&#xE8B8;</i></a></Link>
                            <a href="#" @click="deleteStaff(item.id)" class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE5C9;</i></a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="clearfix">
                <div class="hint-text">Hiển thị <b>{{ staffList.length }}</b> trong số <b>25</b> nhân viên</div>
                <ul class="pagination">
                    <li class="page-item"><a href="#">Previous</a></li>
                    <li class="page-item"><a href="#" class="page-link">1</a></li>
                    <li class="page-item"><a href="#" class="page-link">2</a></li>
                    <li class="page-item active"><a href="#" class="page-link">3</a></li>
                    <li class="page-item"><a href="#" class="page-link">4</a></li>
                    <li class="page-item"><a href="#" class="page-link">5</a></li>
                    <li class="page-item"><a href="#" class="page-link">Next</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>
<style scoped>
.inactive {
    background-color: #656565 !important;
}
.table-responsive {
    margin: 30px 0;
}
.table-wrapper {
    min-width: 1000px;
    padding: 20px 25px;
    border-radius: 3px;
    box-shadow: 0 1px 1px rgba(0,0,0,.05);
}
.table-title {
    padding-bottom: 15px;
    background:#435c70;
    color: #0397d6;
    padding: 16px 30px;
    margin: -20px -25px 10px;
    border-radius: 3px 3px 0 0;
}
.table-title h2 {
    margin: 5px 0 0;
    font-size: 24px;
}
.table-title .btn {
    color: #fff;
    font-weight: bold;
    float: right;
    font-size: 13px;
    background:  rgb(255, 106, 0);
    border: none;
    min-width: 50px;
    border-radius: 2px;
    border: none;
    outline: none !important;
    margin-left: 10px;
}
.table-title .btn:hover, .table-title .btn:focus {
    color: #566787;
    background: #f2f2f2;
}
.table-title .btn i {
    float: left;
    font-size: 21px;
    margin-right: 5px;
}
.table-title .btn span {
    float: left;
    margin-top: 2px;
}
table.table tr th, table.table tr td {
    border-color: #e9e9e9;
    padding: 12px 15px;
    vertical-align: middle;
}
table.table tr th:first-child {
    width: 60px;
}
table.table tr th:last-child {
    width: 100px;
}
table.table-striped tbody tr:nth-of-type(odd) {
    background-color:#435c70;
}
table.table-striped.table-hover tbody tr:hover {
    background: #f5f5f5;
    color: #0397d6 !important;
}
table.table-striped.table-hover tbody tr:hover a{
    color: #0397d6 !important;
}
tr{
    color: #ccc !important;
}
table.table th i {
    font-size: 13px;
    margin: 0 5px;
    cursor: pointer;
}	
table.table td:last-child i {
    opacity: 0.9;
    font-size: 22px;
    margin: 0 5px;
}
table.table td a {
    font-weight: bold;
    color: #fff;
    display: inline-block;
    text-decoration: none;
}
table.table td a:hover {
    color: #2196F3;
}
table.table td a.settings {
    color: #2196F3;
}
table.table td a.delete {
    color: #F44336;
}
table.table td i {
    font-size: 19px;
}
table.table .avatar {
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 10px;
}
.status {
    font-size: 30px;
    margin: 2px 2px 0 0;
    display: inline-block;
    vertical-align: middle;
    line-height: 10px;
}
.text-success {
    color: #10c469;
}
.text-info {
    color: #62c9e8;
}
.text-warning {
    color: #FFC107;
}
.text-danger {
    color: #ff5b5b;
}
.pagination {
    float: right;
    margin: 0 0 5px;
}
.pagination li a {
    border: none;
    font-size: 13px;
    min-width: 30px;
    min-height: 30px;
    color: #999;
    margin: 0 2px;
    line-height: 30px;
    border-radius: 2px !important;
    text-align: center;
    padding: 0 6px;
}
.pagination li a:hover {
    color: #666;
}	
.pagination li.active a, .pagination li.active a.page-link {
    background: #03A9F4;
}
.pagination li.active a:hover {        
    background: #0397d6;
}
.pagination li.disabled i {
    color: #ccc;
}
.pagination li i {
    font-size: 16px;
    padding-top: 6px
}
.hint-text {
    color: #fff;
    float: left;
    margin-top: 10px;
    font-size: 13px;
}
td.role svg  {
cursor: pointer;
display: none;
}
.staff-item:hover td.role svg  {
cursor: pointer;
display: inline-block;
stroke:#0397d6;
}


</style>
