<script setup>
import { ref, reactive } from 'vue'
import Link from '../Link.vue';
import { sendEmailResetPass, resetPassword } from '@/data.function/postData'
const reset = reactive({
    email: '',
    newPassword: '',
    showResetForm: false,
    resetCode: '',
    error: '',
    success: false,
})
const requestPending = ref({
    sendCode: false,
    sendEmail: false,
})
let showPassword = ref(false);
const showPasswordCommand = () => {
    showPassword.value = !showPassword.value;
}
const sendEmail = () => {
    if (!reset.email && reset.email.trim() == "")
        reset.error = 'Vui lòng nhập email'
    else {
        requestPending.value.sendEmail = true;
        sendEmailResetPass(reset.email).then(result => {
            requestPending.value.sendEmail = false;
            if (result.status ==200){
                reset.showResetForm = true
            reset.error = '';
            }
            else if (result.status == 1001) {
                reset.error = 'Email không tồn tại'
            }
        })
    }

}
const sendCode = () => {
    if (reset.newPassword.includes(' ') || reset.newPassword.trim() == '') {
        reset.error = 'Mật khẩu không được chứa khoảng trắng hoặc bỏ trống !';
        return;
    }
    requestPending.value.sendCode = true;
    resetPassword(reset.email, reset.newPassword, reset.resetCode).then(response => {
        if (response.status == 200) {
            reset.error = ''
            reset.success = true;
        } else if (response.status == 3001) {
            reset.error = 'Mã xác nhận không đúng ! Thử lại'
        } else if (response.status == 3002) {
            reset.error = 'Thời gian hết hạn xác nhận mã !'
        } else {
            reset.error = 'Đã xảy ra lỗi, vui lòng thử lại sau !'
        }
        requestPending.value.sendCode = false;
    })
}

</script>

<template>
    <div class="reset-pass-main">
    <div class="brand-header d-flex flex-column justify-content-center align-items-center">
        <img src="/images/logo-anh-duong.png" alt="">
        <div class="brand-name font-effect-fire">Anh Duong Store</div>
    </div>
        <div v-if="!reset.success" class="form-container">
            <div v-if="!reset.showResetForm" class="logo-container">
                Quên mật khẩu ?
            </div>
            <div v-else class="logo-container">
                Nhập reset code
            </div>
            <form class="form">
                <div v-if="reset.error != ''" class="error-code">{{ reset.error }}</div>
                <div v-if="!reset.showResetForm" class="form-group">
                    <label for="email">Email</label>
                    <input v-model="reset.email" type="text" id="email" name="email" placeholder="Enter your email"
                        required="">
                </div>
                <div v-if="reset.showResetForm" class="form-group">
                    <label for="reset-code">Reset code</label>
                    <input v-model="reset.resetCode" type="text" id="reset-code" name="reset-code"
                        placeholder="Enter your reset code" required="">
                </div>
                <div v-if="reset.showResetForm" class="form-group">
                    <label for="reset-code">Mật khẩu mới</label>
                    <div class="input-pass">
                        <input v-model="reset.newPassword" :type="showPassword ? 'text' : 'password'" id="reset-code"
                            name="reset-code" placeholder="Enter your reset code" required="">
                        <i v-if="showPassword" @click="showPasswordCommand" class="fa fa-eye" aria-hidden="true"></i>
                        <i v-else @click="showPasswordCommand" class="fa fa-eye-slash" aria-hidden="true"></i>
                    </div>
                </div>
                <button v-if="!reset.showResetForm" @click.prevent="sendEmail" class="form-submit-btn"
                    type="submit">Send Email</button>
                <button v-else @click.prevent="sendCode" class="form-submit-btn" type="submit">Xác nhận</button>
            </form>
            <p v-if="!reset.showResetForm" class="signup-link">
                Đã là thành viên ?
                <a href="#" class="signup-link link">Login now</a>
            </p>
        </div>
        <div v-if="reset.success" class="card">
            <div style="border-radius:130px; height:130px; width:130px; background: #F8FAF5; margin:0 auto;">
                <i class="checkmark">✓</i>
            </div>
            <h1>Thay đổi thành công</h1>
            <p>Mật khẩu đã được đặt lại<br />
                <Link to="/">Trở lại</Link>
            </p>
        </div>
    </div>
</template>
<style scoped>
.brand-header {
    width: 300px;
    height: 300px;
}
.brand-header img{
    width:200px;
    height: 200px;
}
.brand-name {
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    color: #ff6d6d;
    margin-bottom: 20px;
}
.font-effect-fire {
    text-shadow: 0 -0.05em 0.2em #FFF, 0.01em -0.02em 0.15em #FE0, 0.01em -0.05em 0.15em #FC0, 0.02em -0.15em 0.2em #F90, 0.04em -0.20em 0.3em #F70, 0.05em -0.25em 0.4em #F70, 0.06em -0.2em 0.9em #F50, 0.1em -0.1em 1.0em #F40;
} 
.form-container {
    max-width: 500px;
    background-color: #fff;
    padding: 32px 24px;
    font-size: 14px;
    font-family: inherit;
    color: #212121;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
    border-radius: 10px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.084), 0px 2px 3px rgba(0, 0, 0, 0.168);
    transition: all 0, 5s ease-in-out;
}

.form-container button:active {
    scale: 0.95;
}

.form-container .logo-container {
    text-align: center;
    font-weight: 600;
    font-size: 18px;
}

.form-container .form {
    display: flex;
    flex-direction: column;
}

.form-container .form-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.form-container .form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-container .form-group input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 6px;
    font-family: inherit;
    border: 1px solid #ccc;
}

.form-container .form-group input::placeholder {
    opacity: 0.5;
}

.form-container .form-group input:focus {
    outline: none;
    border-color: #1778f2;
}

.form-container .error-code {
    color: red;
    font-size: 12px;
}

.form-container .input-pass {
    position: relative;
}

.form-container .input-pass i {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
}

.form-container .form-submit-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: inherit;
    color: #fff;
    background-color: #212121;
    border: none;
    width: 100%;
    padding: 12px 16px;
    font-size: inherit;
    gap: 8px;
    margin: 12px 0;
    cursor: pointer;
    border-radius: 6px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.084), 0px 2px 3px rgba(0, 0, 0, 0.168);
}

.form-container .form-submit-btn:hover {
    background-color: #313131;
}

.form-container .link {
    color: #1778f2;
    text-decoration: none;
}

.form-container .signup-link {
    align-self: center;
    font-weight: 500;
}

.form-container .signup-link .link {
    font-weight: 400;
}

.form-container .link:hover {
    text-decoration: underline;
}

.card h1 {
    color: #88B04B;
    font-weight: 900;
    font-size: 40px;
    margin-bottom: 10px;
}

.card p {
    color: #404F5E;
    font-size: 20px;
    margin: 0;
}

.card i {
    position: absolute;
    top: 45%;
    right: 30%;
    transform: translateY(-50%);
    color: #9ABC66;
    font-size: 100px;
    line-height: 200px;
    /* margin-left: -15px; */
}
.card>div:first-child {
    position: relative;
}

.card {
    background: white;
    padding: 35px;
    border-radius: 4px;
    box-shadow: 0 2px 3px #C8D0D8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
}
.card a{
    color: #1778f2;
    width: 100%;
    text-align: center;
    display: block;
}
</style>