<template>
  <div class="profile-container">
    <div v-if="user.isNew && !auth.isAdmin" class="newbie-medal">
      <div class="newbie-tooltip-container">
        <span class="newbie-tooltip">Huy hiệu cho người mới</span>
        <img src="/images/newbie-medal.png" alt="" />
      </div>
    </div>
    <div v-if="auth.isAdmin" style="background-color: golden" class="admin-medal">
      <div class="admin-tooltip-container">
        <span class="admin-tooltip">Huy hiệu cho người quản trị</span>
        <img src="/images/admin-role.png" alt="" />
      </div>
    </div>
    <div class="profile-header">Thông tin cá nhân</div>
    <div class="profile-content">
      <div class="profile-label name">
        <label>Họ tên:</label>
        <span :title="user.name" v-if="!updateCommand.updateName"
          > {{ user.name }}
        </span>
        <svg v-if="!updateCommand.updateName"
            @click="updateNameCommand"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"
            ></path>
            <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
          </svg>
        <span v-if="updateCommand.updateName">
          <input
            @blur="unhandleUpdate"
            :autofocus="updateCommand.updateName"
            v-model="updateUser.name"
            type="text"
          />
        </span>
      </div>
      <div class="profile-label email">
        <label>Email:</label>
        <span>{{ user.email }}</span>
      </div>
      <div class="profile-label phone">
        <label>Số điện thoại:</label>
        <span v-if="!updateCommand.updatePhone"
          >{{ user.phone || "Chưa có" }}
          <svg
            @click="updatePhoneCommand"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"
            ></path>
            <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
          </svg>
        </span>
        <span v-if="updateCommand.updatePhone">
          <input
            @blur="unhandleUpdate"
            :autofocus="updateCommand.updatePhone"
            v-model="updateUser.phone"
            type="text"
          />
        </span>
      </div>
      <div class="profile-label address">
        <label>Địa chỉ:</label>
        <span
          >{{ address }}
          <svg @click="addressInfo"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"
            ></path>
            <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
          </svg>
        </span>
      </div>
      <div v-if="!user.taiKhoan" class="profile-label password">
        <label>Mật khẩu:</label>
        <span>Thay đổi</span>
      </div>
      <div v-else class="profile-label password">
        <label>Liên kết tài khoản:</label>
        <span title="Google">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="0.98em"
            height="1em"
            viewBox="0 0 256 262"
          >
            <path
              fill="#4285f4"
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            />
            <path
              fill="#34a853"
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            />
            <path
              fill="#fbbc05"
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
            />
            <path
              fill="#eb4335"
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            />
          </svg>
        </span>
      </div>
      <div v-if="showUpdateBtn" class="apply-change">
        <button @click="unhandleUpdate(true)">Hủy bỏ</button>
        <button @click="changeUserInfo">Thay đổi</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #f0f0f0;
  position: relative;
}
.profile-container .newbie-medal,
 .profile-container .admin-medal{
  position: absolute;
  top: 0;
  right: 0%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background-image: url("/images/newbie-medal.png");
  background-size: cover;
}
.profile-container .admin-medal {
  background-image: url("/images/admin-role.png");
} 
.profile-container .profile-header {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
}
.profile-content {
  width: 80%;
  padding: 20px;
}
.profile-content .profile-label {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px;
}
.profile-content div.profile-label:first-child {
  align-items: baseline;
  justify-content: flex-start;
}
.profile-content div.profile-label label {
  width: fit-content;
  margin-right: 30px;
}
.profile-content div.profile-label:first-child > span {
  font-weight: bold;
  font-size: 25px;
}
.profile-label.password > span:last-child {
  font-size: 18px;
  color: darkblue;
  cursor: pointer;
}
.profile-label.name input {
  font-size: 15px;
  width: 80%;
}
.profile-label.name>span {
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 60%;
}
.apply-change{
    width: 100%;
  text-align: right;
  margin-top: 12px;
}
.apply-change button{
    display: inline-block;
    padding: 5px 20px;
    background-color: #4CAF50;
    color: white;
    border-radius: 10px;
    border: none;
}
svg {
  margin-left: 5px;
  cursor: pointer;
}
svg:hover {
  color: aqua;
}
.newbie-tooltip-container,
.admin-tooltip-container {
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 17px;
  padding: 0.7em 1.8em;
  width: 100%;
  height: 40px;
  font-family: sans-serif;
}

.newbie-tooltip,
.admin-tooltip {
  position: absolute;
  width: 200%;
  --background: linear-gradient(45deg, #d3ee22, #f1f51f);
  background: var(--background);
  top: -20px;
  left: 50%;
  transform: translateX(-50%) scale(0.8);
  transform-origin: bottom;
  padding: 0.3em 0.6em;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.newbie-tooltip::before,
 .admin-tooltip::before {
  position: absolute;
  content: "";
  height: 0.6em;
  width: 0.6em;
  bottom: -0.2em;
  left: 50%;
  transform: translate(-50%) rotate(45deg);
  background: var(--background);
}

.newbie-tooltip-container:hover .newbie-tooltip,
 .admin-tooltip-container:hover .admin-tooltip {
  top: -100px;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateX(-50%) scale(1);
}
.newbie-tooltip-container:hover {
  transform: scale(0.9);
}
</style>

<script setup>
import router from "@/router";
import { authStore } from "@/stores/user.store";
import { convertToSlug } from "@/utils/util.function";
import { storeToRefs } from "pinia";
import { computed, reactive } from "vue";
const auth = authStore();
const { user } = storeToRefs(auth);
const updateUser = reactive({
  name: user.value.name,
  phone: user.value.phone,
});
const updateCommand = reactive({
  updateName: false,
  updatePhone: false,
});
const address = computed(() => {
  if (user.value.address.length == 0) return "Chưa có";
  return (
    user.value.address.find(address => address.isDefault).diaChi ||
    user.value.address[0]
  );
});
const updateNameCommand = () => {
  updateCommand.updateName = true;
};

const updatePhoneCommand = () => {
  updateCommand.updatePhone = true;
};
const requestPending = reactive({
    pending: false,
    success:false,
    error: false,
});
const unhandleUpdate = (reset=false) => {
    if(reset==true) { // khi ấn hủy bỏ, trở lại trạng thái ban đầu
        updateUser.name = user.value.name;
        updateUser.phone = user.value.phone;
        updateCommand.updateName = false;
        updateCommand.updatePhone = false;
        return;
    }
    if(!showUpdateBtn.value){ //nếu đã bị thay đổi thì không được tắt do blur nữa
        updateCommand.updateName = false;
        updateCommand.updatePhone = false;
    }
    return;
};

const showUpdateBtn = computed(()=>{
    if(updateUser.name !=user.value.name || updateUser.phone != user.value.phone) {
       return true;
    } 
    return false;
})
const changeUserInfo = () =>{
    if(showUpdateBtn.value) {
        requestPending.pending = true;
        auth.updateUserInfo({
            name: updateUser.name == user.value.name ? "":updateUser.name,
            phone: updateUser.phone==user.value.phone ? "": updateUser.phone,
        }).then(response=>{
            if(response) {
                alert("Update successfully");
                requestPending.pending = false;
                requestPending.success = true;
            } else {
                alert("Update failed");
                requestPending.pending = false;
                requestPending.error = true;
            }
            unhandleUpdate(true);

        })
    }
}
const addressInfo = ()=>{
  router.push({name:"address", params:{username:convertToSlug(user.value.name)}});
}
</script>
