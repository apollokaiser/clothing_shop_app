<template>
    <div class="modal fade" id="changePassword" tabindex="-1" aria-labelledby="changePasswordLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="changePasswordLabel">Đổi mật khẩu</h5>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="oldPassword" class="form-label">Mật khẩu cũ</label>
                        <input v-model="account.oldPassword" type="password" class="form-control" id="oldPassword">
                    </div>
                    <div class="mb-3">
                        <label for="newPassword" class="form-label">Mật khẩu mới</label>
                        <input v-model="account.newPassword" type="password" class="form-control" id="newPassword">
                    </div>
                    <div class="mb-3">
                        <label for="re-newPassword" class="form-label">Xác nhận mật khẩu mới</label>
                        <input v-model="reNewPassword" type="password" class="form-control" id="re-newPassword">
                    </div>
                    <em v-if="error" class="text-danger fst-italic">Mật khẩu mới không khớp </em>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                    <button @click.prevent=" changePass" type="button" class="btn btn-primary">Lưu</button>
                </div>
            </div>
        </div>
        <Loading v-if="requestPending.pending"/>
      <Result v-if="requestPending.error || requestPending.success " :success="requestPending.success" :error="requestPending.error">
        <span>{{ requestPending.message }}</span>
      </Result>
    </div>
</template>
<script setup>
import { reactive, ref, watch} from 'vue';
import { authStore } from '@/stores/user.store';
import { storeToRefs } from 'pinia';
import { changePasword } from '@/auth.function/auth';
import Result from '../Admin/Result.vue';
import Loading from '../Loading.vue';
const auth = authStore();
const {user} = storeToRefs(auth)
const account = reactive({
    oldPassword: '',
    newPassword: '',
    email:""
})
const requestPending = reactive({
    pending: false,
    success: false,
    error: false,
    message: ''
})
const error = ref(false);
watch(()=>requestPending.success, value=>{
    if(value) {
        setTimeout(()=>{
            requestPending.success = false;
            requestPending.message = ""
        }, 2000);
    }
})
watch(()=>requestPending.error, value=>{
    if(value) {
        setTimeout(()=>{
            requestPending.error = false;
            requestPending.message = ""
        }, 2000);
    }
})

const reNewPassword = ref(""); 
const changePass = ()=>{
    if(account.newPassword!== reNewPassword.value){
        error.value = true;
        return;
    } else {
        account.email = user.value.email;
        requestPending.pending = true;
        error.value = false;
        changePasword(account).then(res=>{
            requestPending.pending = false;
            if(res.status ==200) {
                requestPending.success = true;
                requestPending.message = "Đổi mật khẩu thành công";
            } else {
                requestPending.error = true;
                requestPending.message = "Đổi mật khẩu thất bại";
            }
        })
    }

}
</script>