<template>
  <div v-if="!requestPending.googleLogin" class="login-container form">
    <form v-if="!requestPending.pending">
      <div class="flex-column">
        <label>Email </label>
      </div>
      <div class="inputForm">
        <input @blur="checkEmail" v-model="user.email" type="text" class="input" placeholder="Enter your Email" />
      </div>
      <em v-if="errorMessage.email" class="text-danger error-message">Email không hợp lệ</em>
      <div class="flex-column">
        <label>Password </label>
      </div>
      <div class="inputForm">
        <input @blur="checkPassword" v-model="user.password" :type="!showPassword ? 'password' : 'text'" class="input" placeholder="Enter your Password" />
        <i v-if="showPassword" @click="showPassword = !showPassword" class="fa-regular fa-eye"></i>
        <i v-else @click="showPassword = !showPassword" class="fa-regular fa-eye-slash"></i>
      </div>
      <em v-if="errorMessage.password" class="text-danger error-message">Mật khẩu không hợp lệ</em>
      <div class="flex-row">
        <Link to="/auth/thay-doi-mat-khau"><span class="span">Quên mật khẩu</span></Link>
      </div>
      <em class="error-login" :class="errorClass" v-if="loginFailed.status != 0">{{ loginFailed.message }}</em>
      <button @click.prevent="loginWithAccount" class="button-submit">
        Đăng nhập
      </button>
      <p class="p">
        Chưa có tài khoản?
        <Link to="dang-ky" @click="closeLogin"><span class="span">Đăng ký</span></Link>
      </p>
      <p class="p line">Hoặc với</p>

      <div class="flex-row">
        <button @click.prevent="loginWithGoogle" class="btn google">
          <svg version="1.1" width="20" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512"
            style="enable-background: new 0 0 512 512" xml:space="preserve">
            <path style="fill: #fbbb00" d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
	c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
	C103.821,274.792,107.225,292.797,113.47,309.408z"></path>
            <path style="fill: #518ef8" d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
	c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
	c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"></path>
            <path style="fill: #28b446" d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
	c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
	c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"></path>
            <path style="fill: #f14336" d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
	c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
	C318.115,0,375.068,22.126,419.404,58.936z"></path>
          </svg>
          Google
        </button>
      </div>
    </form>
    <div v-if="requestPending.pending && !requestPending.googleLogin" id="loading">
      <svg viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
      <span class="loading-text">Vui lòng chờ trong giây lát
        <i v-if="requestPending.wait == 1">{{ "." }}</i>
        <i v-if="requestPending.wait == 2">{{ ".." }}</i>
        <i v-if="requestPending.wait == 3">{{ "..." }}</i>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch, ref } from "vue";
import Link from "../Link.vue";
import { authStore } from "@/stores/user.store";
import { storeToRefs } from "pinia";
import { validateEmail, validatePassword } from "@/utils/validate.funtion";
import { googleSdkLoaded } from "vue3-google-login";
import { Toast } from "@/utils/notification";
const auth = authStore();
const { loginRequest } = storeToRefs(auth);
const loginFailed = reactive({
  status: 0,
  message: "",
});
const user = reactive({
  email: "",
  password: "",
});
const errorMessage = reactive({
  email: false,
  password: false,
});
const showPassword = ref(false);
const checkEmail = ()=>{
  if(user.email == "") errorMessage.email = true;
  else if(!validateEmail(user.email)) errorMessage.email = true;
  else errorMessage.email = false;
}

const checkPassword = ()=>{
  console.log(validatePassword(user.password));
  if(user.password == "") errorMessage.password = true;
  else if(validatePassword(user.password) !=true) errorMessage.password = true;
  else errorMessage.password = false;
}

const validated = computed(()=>{
    checkEmail();
    checkPassword();
    let valid = true;
    Object.keys(user).forEach(key=>{
        if(user[key] == "") {
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
    console.log(user, errorMessage);
    return valid;
})
const errorClass = computed(() => ({
  "text-warning": loginFailed.status == 1003,
  "text-danger": loginFailed.status != 1003,
}));
const requestPending = reactive({
  pending: false,
  googleLogin: false,
  wait: 1,
});
watch(
  () => requestPending.pending,
  (value) => {
    if (value) {
      requestPending.wait = 1;
      setInterval(() => {
        requestPending.wait++;
        if (requestPending.wait > 3) {
          requestPending.wait = 1;
        }
      }, 1000);
    } else {
      clearInterval();
      requestPending.wait = 1;
    }
  }
);
const loginWithAccount = () => {
  console.log(validated.value)
  if (!validated.value) return;
  requestPending.pending = true;
  auth.loginWithAccount(user).then((response) => {
    requestPending.pending = false;
    if (!response) {
      loginFailed.message =
        "Không thể thực hiện đăng nhập thời gian này ! Vui lòng thử lại ";
      loginFailed.status = -999;
    }
    if (response.status == 1003)
      loginFailed.message =
        "Tài khoản chưa được xác thực. Vui lòng vào hộp thư email để xác nhận";
    else if (response.status == 1005) {
      loginFailed.message = "Tài khoản đã được đăng ký thành viên !";
    } else loginFailed.message = "Tài khoản hoặc mật khẩu không đúng";
    loginFailed.status = response.status;
  });
};
const closeLogin = () => {
  loginRequest.value = false;
};

const loginWithGoogle = () => {
  requestPending.googleLogin = true;
  requestPending.pending = true;
  googleSdkLoaded((google) => {
    google.accounts.oauth2
      .initCodeClient({
        client_id:
          "1000426255601-gegcrjo15vbu0vlaibgvlk43q2imtkk3.apps.googleusercontent.com",
        scope: "email profile openid",
        callback: (response) => {
          auth.signInGoogle(response.code).then((res) => {
            if(res==true) {
              requestPending.pending = false;
              requestPending.googleLogin = false;
            } else {
              Toast.fire({
                icon: "error",
                title: "Tài khoản đã được đăng nhập trước đó",
                text: "Vui lòng thử lại sau",
              })
            }
          });
        },
        error_callback: () => {
          //NOTE: only check if user close the window
          requestPending.pending = false;
          requestPending.googleLogin = false;
          loginRequest.value = true;
        },
      })
      .requestCode();
  });
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-20%);
  opacity: 0;
}

.error-login {
  font-size: 14px;
}

#loading {
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  margin: -30px;
  gap: 20px;
}

#loading svg {
  display: block;
  top: 50%;
  left: 50%;
  width: 3.25em;
  transform-origin: center;
  animation: rotate4 2s linear infinite;
}

#loading .loading-text {
  font-size: 20px;
  letter-spacing: 3px;
  color: hsl(214, 97%, 59%);
}

circle {
  fill: none;
  stroke: hsl(214, 97%, 59%);
  stroke-width: 4;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash4 1.5s ease-in-out infinite;
}

@keyframes rotate4 {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash4 {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }

  100% {
    stroke-dashoffset: -125px;
  }
}

.form {
  position: fixed;
  right: 5%;
  top: 19%;
  z-index: 999;
  background-color: #ffffff;
  padding: 30px;
  width: 450px;
  min-height: 450px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

::placeholder {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

form button {
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
}

.error-message {
  font-style: italic;
  font-size: 12px;
}
</style>
