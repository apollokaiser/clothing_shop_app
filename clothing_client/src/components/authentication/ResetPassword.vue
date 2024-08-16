<script setup>
import { ref, reactive, computed } from 'vue'
import Link from '../Link.vue';
import { sendEmailResetPass, resetPassword } from '@/data.function/postData'
import { validateEmail, validatePassword } from '@/utils/validate.funtion';
const reset = reactive({
    email: '',
    newPassword: '',
    rePasswword: '',
    resetCode: '',
    error: '',

})
const requestPending = ref({
    sendCode: false,
    sendEmail: false,
})
let showPassword = ref(false);
const validate = {
    email: value => !!validateEmail(value) || "Email không hợp lệ",
    password: value => !!validatePassword(value) || "Password không hợp lệ",
    re_password: value => value == reset.newPassword || "Mật khẩu không khớp"
}
const checkValidEmail = computed(() => {
    return validateEmail(reset.email);
})
const checkValidPassword = computed(() => {
    return validatePassword(reset.newPassword);
})
const step = ref(1);
const currentTitle = computed(() => {
    switch (step.value) {
        case 1: return 'Nhập email tài khoản'
        case 2: return 'Nhập mã xác thực'
        default: return 'Thông báo'
    }
})
const sendEmail = () => {
    if (!reset.email && reset.email.trim() == "")
        reset.error = 'Vui lòng nhập email'
    else {
        requestPending.value.sendEmail = true;
        sendEmailResetPass(reset.email).then(result => {
            requestPending.value.sendEmail = false;
            if (result.status == 200) {
                step.value = 2;
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
    if(reset.newPassword != reset.rePasswword) {
        return;
    }
    requestPending.value.sendCode = true;
    resetPassword(reset.email, reset.newPassword, reset.resetCode).then(response => {
        requestPending.value.sendCode = false;
        if (response.status == 200) {
            reset.error = ''
            step.value = 3;
        } else if (response.status == 3001) {
            reset.error = 'Mã xác nhận không đúng ! Thử lại'
        } else if (response.status == 3002) {
            reset.error = 'Thời gian hết hạn xác nhận mã !'
        } else {
            reset.error = 'Đã xảy ra lỗi, vui lòng thử lại sau !'
        }
    })
}

</script>

<template>
    <div class="reset-pass-main">
        <div class="brand-header d-flex flex-column justify-content-center align-items-center">
            <!--  <img src="/images/logo-anh-duong.png" alt=""> -->
            <div class="brand-name font-effect-fire">Anh Duong Store</div>
        </div>
        <v-card class="mx-auto w-100" max-width="700">
            <v-card-title class="text-h6 font-weight-regular justify-space-between">
                <span>{{ currentTitle }}</span>
                <v-avatar class="ms-2" color="primary" size="24" v-text="step"></v-avatar>
            </v-card-title>
            <v-window v-model="step">
                <v-window-item :value="1">
                    <v-card-text>
                        <v-text-field v-model="reset.email" :rules="[validate.email]" :error-messages="reset.error"
                            label="Email" placeholder="nguyenvana@gmail.com">
                        </v-text-field>
                        <span class="text-caption text-grey-darken-1">
                            Email dùng cho quá trình gửi mã xác thực
                        </span>
                    </v-card-text>
                </v-window-item>

                <v-window-item :value="2">
                    <v-card-text>
                        <div class="text-body-2">
                            Chúng tôi đã gửi mã xác thực đến <br> Vui lòng kiểm tra hộp thư của bạn
                        </div>
                        <v-otp-input v-model="reset.resetCode" type="password" variant="solo" :length="7"></v-otp-input>
                        <v-text-field v-model="reset.newPassword" label="Mật khẩu mới"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="[validate.password]"
                            :type="showPassword ? 'text' : 'password'" counter
                            @click:append="showPassword = !showPassword" :error-messages="reset.error"></v-text-field>
                        <v-text-field v-model="reset.rePasswword" label="Xác nhận mật khẩu"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="[validate.password, validate.re_password]"
                            :type="showPassword ? 'text' : 'password'" counter
                            @click:append="showPassword = !showPassword"></v-text-field>
                    </v-card-text>
                </v-window-item>
                <v-window-item :value="3">
                    <div class="card d-flex justify-content-center align-items-center">
                        <div
                            style="border-radius:130px; height:130px; width:130px; background: #F8FAF5; margin:0 auto;">
                            <i class="checkmark">✓</i>
                        </div>
                        <h1>Thay đổi thành công</h1>
                        <p class="text-center">Mật khẩu đã được đặt lại<br />
                            <Link to="/">Trở lại</Link>
                        </p>
                    </div>
                </v-window-item>
            </v-window>

            <v-divider></v-divider>

            <v-card-actions>
            <v-btn v-if="step ==1 " color="primary" variant="flat" @click="$router.back()">
                Trở lại
            </v-btn>
                <v-btn v-if="step > 1 && step != 3" variant="text" @click="step--">
                    Back
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn v-if="step == 1" :disabled="!checkValidEmail" color="primary" variant="flat" @click="sendEmail">
                    Gửi mã xác nhận
                </v-btn>
                <v-btn v-if="step == 2" :disabled="!checkValidPassword || !reset.resetCode" color="primary"
                    variant="flat" @click.prevent="sendCode">
                    Thay đổi mật khẩu
                </v-btn>
            </v-card-actions>
            <v-progress-linear :active="requestPending.sendEmail || requestPending.sendCode" :indeterminate="requestPending.sendEmail || requestPending.sendCode"
                color="deep-purple-accent-4" absolute bottom>
            </v-progress-linear>
        </v-card>
    </div>
</template>
<style scoped>
.reset-pass-main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    width: 500px;
}

.brand-header {
    width: 500px;
    /* height: 200px; */
}

.brand-header img {
    width: 200px;
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

.card a {
    color: #1778f2;
    width: 100%;
    text-align: center;
    display: block;
}
</style>