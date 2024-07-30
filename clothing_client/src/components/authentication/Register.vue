<template>
    <div class="signup-container">
        <form class="form">
            <div class="flex-column">
                <label>Email <i class="text-danger">*</i> </label>
            </div>
            <div class="inputForm">
                <input @blur="checkEmail" v-model="signupForm.email" type="text" class="input" placeholder="Enter your Email">
            </div>
                <em v-if="errorMessage.email" class="text-danger error-message">Email không hợp lệ</em>
            <div class="flex-column">
                <label>Họ tên <i class="text-danger">*</i></label>
            </div>
            <div class="inputForm">
                <input @blur="checkName" v-model="signupForm.name" type="text" class="input" placeholder="Enter your name" autocomplete="off" autocorrect="off">
            </div>
            <em v-if="errorMessage.name" class="text-danger error-message">Họ tên không thể bỏ trống</em>
            <div class="flex-column">
                <label>Mật khẩu <i class="text-danger">*</i></label>
            </div>
            <div class="inputForm">
                <input @blur="checkPassword" v-model="signupForm.password" type="password" class="input" placeholder="Enter your Password">
                <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z">
                    </path>
                </svg>
            </div>
            <div v-if="!errorMessage.password.status" class="error-message d-flex flex-column">
            <em class="text-danger">{{ errorMessage.password.message }}</em>
            <em>Mật khẩu bao gồm: tối thiểu 8 ký tự và tối đa 20 ký tự, ít nhất 1 số, 1 chữ hoa và 1 chữ thường</em>
            </div>
            <div class="flex-column">
                <label>Xác nhận mật khẩu <i class="text-danger">*</i></label>
            </div>
            <div class="inputForm">
                <input @change="checkConfirmPass" v-model="signupForm.re_password" type="password" class="input" placeholder="Enter your Password">
                <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z">
                    </path>
                </svg>
            </div>
            <em v-if="checkConfirmPass!=null && checkConfirmPass==false" class="text-danger fst-italic error-message">Mật khẩu không khớp</em>
            <em v-if="error" class="text-danger fst-italic">Tài khoản đã tồn tại</em>
            <div class="flex-row">
                <Link to="/auth/thay-doi-mat-khau"><span class="span">Quên mật khẩu </span></Link>
            </div>
            <button @click.prevent="signupWithAccount" class="button-submit">Đăng ký</button>
            <p class="p"> Đã là thành viên ?
                <Link to="/"><span class="span">Đăng nhập</span></Link>
            </p>
        </form>
        <transition name="slide-fade">
            <Notification v-if="showMsg">
                <template v-slot:title>
                    <span>Thành công</span>
                </template>
                <template v-slot:message>
                    <span>Đăng ký thành công !! Mở email và xác thực ngay nào !</span>
                </template>
            </Notification>
        </transition>
    </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { ref, reactive, computed } from 'vue'
import Link from '../Link.vue';
import { register } from '@/auth.function/auth';
import { validateEmail, validatePassword } from '@/utils/validate.funtion';
import { useRouter } from 'vue-router';
const router = useRouter();
const signupForm = reactive({
    email: "",
    password: "",
    re_password: "",
    name: ""
})
const errorMessage = reactive({
    email:false,
    password:false,
    re_password:false,
    name:false
})
const checkEmail =()=>{
    if(!validateEmail(signupForm.email)) {
        errorMessage.email = true;
    } else {
        errorMessage.email = false;
    }
}
const checkPassword =() =>{
    if(signupForm.password == "") { 
        console.log("password is blank");
        errorMessage.password = {
            status: false,
            message: "Mât khẩu không thể trống"
        }
        return;
    }
    let result = validatePassword(signupForm.password, signupForm.name);
    if(result.status) {
        errorMessage.password = result;
        return;
    } else if(!result) {
        errorMessage.password = {
            status: false,
            message: "Mât khẩu không hợp lệ"
        }
        return;
    }  else errorMessage.password = true;
}
const checkConfirmPass = computed(()=>{
    if(signupForm.re_password == "") {
        return null;
    }
    if(signupForm.password != signupForm.re_password) {
        return false;
    } else {
        return true;
    }
})
const checkName = ()=>{
    if(signupForm.name == "") {
        errorMessage.name = true;
    } else {
        errorMessage.name = false;
    }
}
const validated = computed(()=>{
    let valid = true;
    Object.keys(signupForm).forEach(key=>{
        if(signupForm[key] == "") {
            valid = false;
            return false;
        }
    })
    Object.keys(errorMessage).forEach(key=>{
        if(errorMessage[key] != false) {
            valid = false;
            return false;
        }
    })
    return valid;
})
const error = ref(false);
const openMessage = () => {
    (async () => {
        const { value: isConfirmed } = await Swal.fire({
            title: 'Đăng ký thành công',
            text: 'Bạn đã thành công đăng ký tài khoản với chúng tôi',
            icon: 'success',
            confirmButtonText: 'OK',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'button-swal',
            },
            footer: '<center><i>Hãy xem ngay hộp thư mail để thực hiện xác thực, trân trọng !</i></center>',
        })
        if (isConfirmed) {
            router.push('/');
        }
    })()
}
const signupWithAccount = () => {
    if(validated.value) {
        Swal.fire({
            title: 'Thông báo',
            text: 'Vui lòng nhập tất cả thông tin yêu cầu',
            icon: 'info',
            confirmButtonText: 'Đồng ý',
        })
    } else {
        register(signupForm).then(response =>{
            if(!response) error.value = true;
            else openMessage();
        })
    }
}
</script>

<style scoped>
.signup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.form {
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 30px;
    width: 450px;
    border-radius: 20px;
    border: 1px solid #ccc;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

::placeholder {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.form button {
    align-self: flex-end;
}

.flex-column>label {
    color: #151717;
    font-weight: 600;
}

.inputForm {
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    transition: 0.2s ease-in-out;
}

.input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 85%;
    height: 100%;
}

.input:focus {
    outline: none;
}

.inputForm:focus-within {
    border: 1.5px solid #2d79f3;
}

.flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
}

.flex-row>div>label {
    font-size: 14px;
    color: black;
    font-weight: 400;
}

.span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
}

.button-submit {
    margin: 20px 0 10px 0;
    background-color: #151717;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
}

.button-submit:hover {
    background-color: #252727;
}

.p {
    text-align: center;
    color: black;
    font-size: 14px;
    margin: 5px 0;
}

.btn {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    gap: 10px;
    border: 1px solid #ededef;
    background-color: white;
    cursor: pointer;
    transition: 0.2s ease-in-out;
}

.btn:hover {
    border: 1px solid #2d79f3;
    ;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.5s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
    transform: translateY(-20%);
    opacity: 0;
}

.error-message {
    font-size: 12px;
    margin-top: 5px;
    font-weight: 400;
}
</style>